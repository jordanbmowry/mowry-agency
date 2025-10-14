<script setup lang="ts">
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Button,
  Img,
  Hr,
  Tailwind,
} from '@vue-email/components';

// Define props for the email template
defineProps<{
  leadData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    coverageType: string;
    desiredCoverage: string;
    timeFrame: string;
    age: string;
    healthConditions: string;
    budgetRange: string;
    currentCoverage: string;
    additionalInfo?: string;
    preferredContact: string;
    tcpaConsent: boolean;
    submittedAt: string;
  };
}>();

// Simplified Tailwind config for emails
const emailTailwindConfig = {
  theme: {
    extend: {
      colors: {
        brand: {
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
    },
  },
};
</script>

<template>
  <Html lang="en">
    <Head>
      <title>New Quote Request - Mowry Agency</title>
    </Head>
    <Tailwind :config="emailTailwindConfig">
      <Body class="bg-zinc-50 font-sans">
        <Container class="bg-white mx-auto max-w-2xl">
          <!-- Header -->
          <Section class="bg-brand-700 p-6 text-center">
            <Img
              src="https://mowryagency.com/images/Mowry_Agency_Logo.png"
              alt="Mowry Agency"
              width="60"
              height="60"
              class="mb-4 mx-auto"
            />
            <Heading class="text-white text-2xl font-bold m-0">
              🚨 New Quote Request
            </Heading>
          </Section>

          <!-- Content -->
          <Section class="p-8">
            <Text class="text-lg text-zinc-900 mb-6">
              You have received a new quote request through the website.
            </Text>

            <!-- Lead Information -->
            <Section class="bg-zinc-50 p-6 rounded-lg mb-6">
              <Heading class="text-xl font-bold text-zinc-900 mb-4">
                Contact Information
              </Heading>

              <Text class="text-base text-zinc-700 mb-2">
                <strong>Name:</strong> {{ leadData.firstName }}
                {{ leadData.lastName }}
              </Text>
              <Text class="text-base text-zinc-700 mb-2">
                <strong>Email:</strong> {{ leadData.email }}
              </Text>
              <Text class="text-base text-zinc-700 mb-2">
                <strong>Phone:</strong> {{ leadData.phone }}
              </Text>
              <Text class="text-base text-zinc-700 mb-2">
                <strong>Preferred Contact:</strong>
                {{ leadData.preferredContact }}
              </Text>
              <Text class="text-base text-zinc-700">
                <strong>Submitted:</strong> {{ leadData.submittedAt }}
              </Text>
            </Section>

            <!-- Coverage Details -->
            <Section class="bg-blue-50 p-6 rounded-lg mb-6">
              <Heading class="text-xl font-bold text-zinc-900 mb-4">
                Coverage Details
              </Heading>

              <Text class="text-base text-zinc-700 mb-2">
                <strong>Coverage Type:</strong> {{ leadData.coverageType }}
              </Text>
              <Text class="text-base text-zinc-700 mb-2">
                <strong>Desired Coverage:</strong>
                {{ leadData.desiredCoverage }}
              </Text>
              <Text class="text-base text-zinc-700 mb-2">
                <strong>Time Frame:</strong> {{ leadData.timeFrame }}
              </Text>
              <Text class="text-base text-zinc-700 mb-2">
                <strong>Age:</strong> {{ leadData.age }}
              </Text>
              <Text class="text-base text-zinc-700 mb-2">
                <strong>Budget Range:</strong> {{ leadData.budgetRange }}
              </Text>
              <Text class="text-base text-zinc-700 mb-2">
                <strong>Current Coverage:</strong>
                {{ leadData.currentCoverage }}
              </Text>
              <Text class="text-base text-zinc-700">
                <strong>Health Conditions:</strong>
                {{ leadData.healthConditions }}
              </Text>
            </Section>

            <!-- Additional Information -->
            <Section
              v-if="leadData.additionalInfo"
              class="bg-yellow-50 p-6 rounded-lg mb-6"
            >
              <Heading class="text-xl font-bold text-zinc-900 mb-4">
                Additional Information
              </Heading>

              <Text class="text-base text-zinc-700 italic">
                "{{ leadData.additionalInfo }}"
              </Text>
            </Section>

            <!-- TCPA Consent -->
            <Section class="bg-green-50 p-6 rounded-lg mb-6">
              <Heading class="text-lg font-bold text-zinc-900 mb-2">
                TCPA Consent
              </Heading>

              <Text class="text-base text-zinc-700">
                <strong>Consent Given:</strong>
                {{ leadData.tcpaConsent ? 'YES ✅' : 'NO ❌' }}
              </Text>

              <Text
                v-if="leadData.tcpaConsent"
                class="text-sm text-green-700 mt-2"
              >
                The prospect has provided consent to be contacted for insurance
                purposes.
              </Text>
            </Section>

            <!-- Action Buttons -->
            <Section class="text-center mb-6">
              <Button
                :href="`tel:${leadData.phone}`"
                class="bg-brand-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-700 mr-4"
              >
                Call {{ leadData.firstName }}
              </Button>

              <Button
                :href="`mailto:${leadData.email}?subject=Re: Your Insurance Quote Request`"
                class="bg-zinc-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-zinc-700"
              >
                Email {{ leadData.firstName }}
              </Button>
            </Section>

            <Hr class="border-zinc-200 my-6" />

            <!-- Footer -->
            <Text class="text-sm text-zinc-500 text-center">
              This notification was automatically generated from your website
              quote form.
              <br />
              <strong>Response Time Goal:</strong> Contact within 24 hours
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
</template>
