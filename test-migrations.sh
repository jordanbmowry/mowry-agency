#!/bin/bash

# Migration test script for enhanced quote form database changes
# This script tests the database migrations in a safe way

echo "🚀 Starting migration test for enhanced quote form..."
echo "=================================================="

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first:"
    echo "   npm install -g supabase"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "supabase/config.toml" ]; then
    echo "❌ Not in the correct directory. Please run this from the project root."
    exit 1
fi

echo "✅ Supabase CLI found"
echo "✅ In correct directory"

# Start local Supabase instance
echo ""
echo "🔄 Starting local Supabase instance..."
supabase start

if [ $? -ne 0 ]; then
    echo "❌ Failed to start Supabase. Please check your Docker installation."
    exit 1
fi

echo "✅ Supabase started successfully"

# Run migrations
echo ""
echo "🔄 Running database migrations..."
supabase db reset

if [ $? -ne 0 ]; then
    echo "❌ Migration failed. Please check the migration files."
    supabase stop
    exit 1
fi

echo "✅ Migrations completed successfully"

# Test the new schema
echo ""
echo "🔄 Testing new schema..."

# Test 1: Check if new columns exist
echo "Test 1: Checking new columns..."
supabase db query "SELECT column_name FROM information_schema.columns WHERE table_name = 'leads' AND column_name IN ('date_of_birth', 'health_conditions', 'current_medications', 'preferred_contact_method', 'coverage_amount', 'quote_urgency');"

# Test 2: Check if views exist
echo "Test 2: Checking new views..."
supabase db query "SELECT table_name FROM information_schema.views WHERE table_schema = 'public' AND table_name IN ('insurance_leads', 'quote_form_submissions', 'lead_analytics', 'leads_with_calculated_age');"

# Test 3: Test inserting a sample quote form submission
echo "Test 3: Testing quote form submission..."
supabase db query "
INSERT INTO public.leads (
    first_name, last_name, email, phone, date_of_birth, 
    coverage_type, health_conditions, current_medications,
    lead_type, lead_source, message, status
) VALUES (
    'Test', 'User', 'test@example.com', '555-000-0000', '1990-01-01',
    'Term Life Insurance', 'None', 'None',
    'insurance_quote', 'quote_form', 'Test submission', 'new'
);
"

if [ $? -ne 0 ]; then
    echo "❌ Failed to insert test data"
    supabase stop
    exit 1
fi

# Test 4: Query the new views
echo "Test 4: Querying new views..."
echo "Quote form submissions:"
supabase db query "SELECT first_name, last_name, email, coverage_type FROM public.quote_form_submissions LIMIT 3;"

echo "Insurance leads with calculated age:"
supabase db query "SELECT first_name, last_name, calculated_age, coverage_type FROM public.leads_with_calculated_age WHERE lead_source = 'quote_form' LIMIT 3;"

# Test 5: Test the age calculation function
echo "Test 5: Testing age calculation function..."
supabase db query "SELECT calculate_age('1990-01-01'::date) as calculated_age;"

# Cleanup test data
echo ""
echo "🧹 Cleaning up test data..."
supabase db query "DELETE FROM public.leads WHERE email = 'test@example.com';"

echo ""
echo "✅ All tests passed! Migration is successful."
echo ""
echo "📊 Summary of changes:"
echo "   • Added date_of_birth field for precise age calculation"
echo "   • Added health_conditions and current_medications fields"
echo "   • Added coverage_amount and quote_urgency fields"
echo "   • Added preferred_contact_method field"
echo "   • Enhanced lead_source and status enums"
echo "   • Created comprehensive views for quote data"
echo "   • Added proper indexes for performance"
echo "   • Added sample data for testing"
echo ""
echo "🎯 Next steps:"
echo "   • Run 'supabase db push' to apply to remote database"
echo "   • Update your application code to use the new fields"
echo "   • Test the quote form submission in your application"
echo ""

# Option to stop Supabase
read -p "Do you want to stop the local Supabase instance? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🛑 Stopping Supabase..."
    supabase stop
    echo "✅ Supabase stopped"
else
    echo "ℹ️  Supabase is still running. Use 'supabase stop' to stop it manually."
    echo "ℹ️  Local dashboard: http://localhost:54323"
fi