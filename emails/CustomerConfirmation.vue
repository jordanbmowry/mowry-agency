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
  customerData: {
    firstName: string;
    email: string;
    coverageType: string;
  };
  agencyEmail: string;
  unsubscribeLink: string;
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
      <title>Thank You - Mowry Agency</title>
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
              Thank You for Your Interest!
            </Heading>
          </Section>

          <!-- Content -->
          <Section class="p-8">
            <Text class="text-lg text-zinc-900 mb-4">
              Dear {{ customerData.firstName }},
            </Text>

            <Text class="text-base text-zinc-600 leading-relaxed mb-6">
              We've received your request for
              <strong>{{ customerData.coverageType }}</strong> coverage and are
              excited to help protect what matters most to your family.
            </Text>

            <Text class="text-base text-zinc-600 leading-relaxed mb-6">
              Our licensed insurance specialists will review your information
              and contact you within
              <strong>24 hours</strong> to discuss your coverage options and
              answer any questions you may have.
            </Text>

            <!-- What's Next Section -->
            <Section class="bg-zinc-50 p-6 rounded-lg mb-6">
              <Heading class="text-xl font-bold text-zinc-900 mb-4">
                What's Next?
              </Heading>

              <Text class="text-sm text-zinc-600 mb-2">
                • We'll review your information and prepare personalized
                coverage options
              </Text>
              <Text class="text-sm text-zinc-600 mb-2">
                • One of our licensed agents will call you to discuss your needs
              </Text>
              <Text class="text-sm text-zinc-600 mb-2">
                • We'll provide you with competitive quotes from top-rated
                carriers
              </Text>
              <Text class="text-sm text-zinc-600">
                • You'll receive a customized proposal tailored to your family's
                needs
              </Text>
            </Section>

            <!-- Contact Information -->
            <Section class="border border-zinc-200 p-6 rounded-lg mb-6">
              <Heading class="text-lg font-bold text-zinc-900 mb-4">
                Need to reach us sooner?
              </Heading>

              <Text class="text-base text-zinc-600 mb-2">
                <strong>Phone:</strong> (930) 322-1962
              </Text>
              <Text class="text-base text-zinc-600 mb-4">
                <strong>Email:</strong> {{ agencyEmail }}
              </Text>

              <Button
                href="tel:+19303221962"
                class="bg-brand-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-700"
              >
                Call Us Now
              </Button>
            </Section>

            <Hr class="border-zinc-200 my-6" />

            <!-- Footer -->
            <Text class="text-sm text-zinc-500 leading-relaxed">
              We're committed to helping families build lasting legacies through
              smart insurance planning. Thank you for considering Mowry Agency
              for your insurance needs.
            </Text>

            <Text class="text-sm text-zinc-500 mt-4">
              Best regards,<br />
              <strong>The Mowry Agency Team</strong><br />
              Licensed Insurance Professionals
            </Text>

            <!-- Unsubscribe -->
            <Hr class="border-zinc-200 my-6" />

            <Text class="text-xs text-zinc-400 text-center">
              This email was sent to {{ customerData.email }} because you
              requested a quote from Mowry Agency.
              <br />
              <a :href="unsubscribeLink" class="text-zinc-500 underline">
                Unsubscribe from future emails
              </a>
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
</template>
