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
import {
  BUSINESS_INFO,
  COMPLIANCE_DISCLAIMERS,
  formatLicenseDisplay,
} from '../app/constants/licenses';

// Define props for the email template
defineProps<{
  customerData: {
    firstName: string;
    email: string;
    coverageType: string;
    tcpaText?: string;
    emailMarketingConsent?: boolean;
    tcpaConsentTimestamp?: string;
  };
  agencyEmail: string;
  agencyPhone: string;
  agencyAddress: string;
  agencyWebsite: string;
  agencyNpn: string;
  unsubscribeLink: string;
}>();

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
      <title>Thank You — Your Life Insurance Quote Request Has Been Received</title>
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
              Thank You — Your Life Insurance Quote Request Has Been Received
            </Heading>
          </Section>

          <!-- Content -->
          <Section class="p-8">
            <Text class="text-lg text-zinc-900 mb-4">
              Hi {{ customerData.firstName }},
            </Text>

            <Text class="text-base text-zinc-600 leading-relaxed mb-4">
              Thank you for requesting a personalized life insurance quote from
              {{ BUSINESS_INFO.businessName }}.
            </Text>

            <Text class="text-base text-zinc-600 leading-relaxed mb-6">
              One of our licensed agents will contact you within 24 hours to review your
              coverage options and provide your customized quote.
            </Text>

            <Text class="text-base text-zinc-600 leading-relaxed mb-6">
              We specialize in term life, whole life, indexed universal life (IUL), and
              mortgage protection insurance — designed to protect your family's financial
              future.
            </Text>

            <!-- Contact Information -->
            <Section class="border border-zinc-200 p-6 rounded-lg mb-6">
              <Heading class="text-lg font-bold text-zinc-900 mb-4">
                📞 Contact Information
              </Heading>

              <Text class="text-base text-zinc-600 mb-2">
                <strong>{{ BUSINESS_INFO.businessName }}</strong
                ><br />
                Owned by {{ BUSINESS_INFO.ownerEntity }}
              </Text>

              <Text class="text-base text-zinc-600 mb-2">
                <strong>Email:</strong> {{ agencyEmail }}
              </Text>

              <Text class="text-base text-zinc-600 mb-2">
                <strong>Phone:</strong> {{ agencyPhone }}
              </Text>

              <Text class="text-base text-zinc-600 mb-4">
                <strong>Website:</strong>
                {{ agencyWebsite.replace("https://", "").replace("http://", "") }}
              </Text>

              <Text class="text-base text-zinc-600 mb-4">
                <strong>Address:</strong> {{ agencyAddress }}
              </Text>

              <Button
                :href="`tel:${agencyPhone.replace(/[^\d]/g, '')}`"
                class="bg-brand-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-700"
              >
                Call Us Now
              </Button>
            </Section>

            <!-- TCPA Consent Summary -->
            <Section class="bg-blue-50 border border-blue-200 p-6 rounded-lg mb-6">
              <Heading class="text-lg font-bold text-blue-900 mb-4">
                📋 Consent Confirmation
              </Heading>

              <Text class="text-sm text-blue-800 leading-relaxed mb-4">
                <strong>Communication Consent:</strong> You have consented to receive
                communications from {{ BUSINESS_INFO.businessName }} and our licensed
                agents.
              </Text>

              <div
                v-if="customerData.tcpaText"
                class="bg-white border border-blue-300 p-4 rounded mb-4"
              >
                <Text class="text-xs text-blue-700 font-semibold mb-2">
                  Exact consent you agreed to:
                </Text>
                <Text class="text-xs text-blue-700 leading-relaxed italic">
                  "{{ customerData.tcpaText }}"
                </Text>
              </div>

              <Text class="text-sm text-blue-800 leading-relaxed mb-2">
                <strong>Marketing Emails:</strong>
                {{
                  customerData.emailMarketingConsent
                    ? "You have opted to receive marketing communications."
                    : "You have not opted in for marketing communications (quote-related only)."
                }}
              </Text>

              <Text class="text-xs text-blue-600 leading-relaxed">
                You may opt out of communications at any time using the unsubscribe link
                below or by contacting us directly.
              </Text>
            </Section>

            <!-- Licensing & Disclosure Information -->
            <Section class="bg-zinc-50 p-6 rounded-lg mb-6">
              <Heading class="text-lg font-bold text-zinc-900 mb-4 flex items-center">
                🧾 Important Licensing & Disclosure Information
              </Heading>

              <Text class="text-sm text-zinc-600 leading-relaxed mb-4">
                {{ BUSINESS_INFO.businessName }} is owned and operated by
                {{ BUSINESS_INFO.ownerEntity }}.
              </Text>

              <Text class="text-sm text-zinc-600 leading-relaxed mb-2">
                We are licensed to sell life insurance in the following states:
              </Text>

              <Text
                class="text-xs text-zinc-600 font-mono leading-relaxed mb-4 bg-white p-3 rounded border"
              >
                {{ formatLicenseDisplay("short") }}
              </Text>

              <Text class="text-sm text-zinc-600 leading-relaxed mb-4">
                <strong>National Producer Number (NPN):</strong>
                {{ agencyNpn }}
              </Text>

              <Text class="text-sm text-zinc-600 leading-relaxed">
                {{ COMPLIANCE_DISCLAIMERS.quote }}
              </Text>
            </Section>

            <Hr class="border-zinc-200 my-6" />

            <!-- Footer -->
            <Text class="text-sm text-zinc-500 leading-relaxed mb-4">
              We're committed to helping families build lasting legacies through smart
              insurance planning. Thank you for considering
              {{ BUSINESS_INFO.businessName }}
              for your insurance needs.
            </Text>

            <Text class="text-sm text-zinc-500 mb-4">
              Best regards,<br />
              <strong>The {{ BUSINESS_INFO.businessName }} Team</strong><br />
              Licensed Insurance Professionals
            </Text>

            <!-- Unsubscribe -->
            <Hr class="border-zinc-200 my-6" />

            <Text class="text-xs text-zinc-400 text-center leading-relaxed">
              This email was sent to {{ customerData.email }} because you requested a
              quote from {{ BUSINESS_INFO.businessName }}. <br /><br />
              If you did not request this quote or wish to unsubscribe from future
              communications,
              <a :href="unsubscribeLink" class="text-zinc-500 underline">
                click here to unsubscribe </a
              >.
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
</template>
