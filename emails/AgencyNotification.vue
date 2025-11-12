<script setup lang="ts">
// @ts-nocheck - vue-email components have incomplete type definitions but work at runtime
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Section,
  Tailwind,
  Text,
} from '@vue-email/components';
import { formatSubmittedDate } from '~/utils/dateUtils';

interface LeadData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  coverage_type: string;
  health_conditions: string;
  current_medications: string;
  message?: string;
  city?: string;
  state?: string;
  tcpa_consent: boolean;
  submittedAt?: string;
}

interface Props {
  leadData: LeadData;
}

defineProps<Props>();

// Simplified Tailwind config for emails - partial config accepted by vue-email
// Partial Tailwind config for email styling
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
} as const;
</script>

<template>
  <Html lang="en">
    <Head>
      <title>New Quote Request - Mowry Agency</title>
    </Head>
    <!-- @ts-expect-error - Partial Tailwind config is sufficient for email styling -->
    <Tailwind :config="emailTailwindConfig">
      <Body class="bg-zinc-50 font-sans">
        <Container class="bg-white mx-auto max-w-2xl">
          <!-- Header -->
          <Section class="bg-brand-700 p-6 text-center">
            <Img
              src="https://mowryagency.com/images/mowry_agency_logo_darkmode.png"
              alt="Mowry Agency"
              width="80"
              height="80"
              class="mb-4 mx-auto"
              style="filter: brightness(0) invert(1)"
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
                <strong>Name:</strong> {{ leadData.first_name }}
                {{ leadData.last_name }}
              </Text>
              <Text class="text-base text-zinc-700 mb-2">
                <strong>Email:</strong> {{ leadData.email }}
              </Text>
              <Text class="text-base text-zinc-700 mb-2">
                <strong>Phone:</strong> {{ leadData.phone }}
              </Text>
              <Text class="text-base text-zinc-700 mb-2">
                <strong>Date of Birth:</strong> {{ leadData.date_of_birth }}
              </Text>
              <Text class="text-base text-zinc-700 mb-2">
                <strong>Location:</strong> {{ leadData.city }},
                {{ leadData.state }}
              </Text>
              <Text class="text-base text-zinc-700">
                <strong>Submitted:</strong>
                {{ formatSubmittedDate(leadData.submittedAt || "") }}
              </Text>
            </Section>

            <!-- Coverage Details -->
            <Section class="bg-blue-50 p-6 rounded-lg mb-6">
              <Heading class="text-xl font-bold text-zinc-900 mb-4">
                Coverage Details
              </Heading>

              <Text class="text-base text-zinc-700 mb-2">
                <strong>Coverage Type:</strong> {{ leadData.coverage_type }}
              </Text>
              <Text class="text-base text-zinc-700 mb-2">
                <strong>Health Conditions:</strong>
                {{ leadData.health_conditions }}
              </Text>
              <Text class="text-base text-zinc-700">
                <strong>Current Medications:</strong>
                {{ leadData.current_medications }}
              </Text>
            </Section>

            <!-- Additional Information -->
            <!-- Additional Information -->
            <Section v-if="leadData.message" class="bg-yellow-50 p-6 rounded-lg mb-6">
              <Heading class="text-xl font-bold text-zinc-900 mb-4">
                Additional Message
              </Heading>

              <Text class="text-base text-zinc-700 italic">
                "{{ leadData.message }}"
              </Text>
            </Section>

            <!-- TCPA Consent Status -->
            <Section class="bg-green-50 p-6 rounded-lg mb-6">
              <Heading class="text-xl font-bold text-zinc-900 mb-4">
                TCPA Consent Status
              </Heading>

              <Text class="text-base text-zinc-700 mb-4">
                <strong>TCPA Consent Given:</strong>
                {{ leadData.tcpa_consent ? "YES ✅" : "NO ❌" }}
              </Text>

              <Text
                v-if="leadData.tcpa_consent"
                class="text-sm text-green-600 font-medium"
              >
                ✅ Customer has provided explicit consent to be contacted for insurance
                quotes and information via phone, text, or email.
              </Text>
            </Section>

            <!-- Action Buttons -->
            <Section class="text-center">
              <Button
                :href="`tel:${leadData.phone}`"
                class="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 mr-4 mb-2"
              >
                Call {{ leadData.first_name }}
              </Button>

              <Button
                :href="`mailto:${leadData.email}`"
                class="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700"
              >
                Email {{ leadData.first_name }}
              </Button>
            </Section>

            <Hr class="border-zinc-200 my-6" />

            <!-- Footer -->
            <Text class="text-sm text-zinc-500 text-center">
              This notification was automatically generated from your website quote form.
              <br />
              <strong>Response Time Goal:</strong> Contact within 24 hours
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
</template>
