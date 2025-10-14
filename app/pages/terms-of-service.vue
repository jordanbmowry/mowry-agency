<template>
  <SimpleLayout
    title="Terms of Service"
    intro="Terms and conditions for using our website and services."
  >
    <Container>
      <div class="prose prose-zinc dark:prose-invert max-w-none">
        <p class="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
          Last updated: {{ lastUpdated }}
        </p>

        <h2>Acceptance of Terms</h2>
        <p>
          By accessing and using this website, you accept and agree to be bound
          by the terms and provision of this agreement. If you do not agree to
          abide by the above, please do not use this service.
        </p>

        <h2>About Our Services</h2>
        <p>
          Mowry Agency, owned and operated by Mowry Digital Enterprise LLC, is a
          licensed insurance agency that provides life insurance quotes,
          consultations, and related services. We are an independent agency
          representing multiple insurance carriers.
        </p>

        <h2>Licensing and Authorization</h2>
        <p>
          Mowry Agency is licensed to sell life insurance in multiple states.
          Our licensing information is displayed in the footer of our website
          and includes our National Producer Number (NPN): 16357772.
        </p>
        <p>
          <strong>Important:</strong> We can only provide insurance services to
          residents of states where we are licensed. Not all products are
          available in all states.
        </p>

        <h2>No Guarantees or Warranties</h2>
        <p>
          While we strive to provide accurate information and competitive
          quotes:
        </p>
        <ul>
          <li>
            Quotes are estimates and not binding until an insurance contract is
            issued
          </li>
          <li>
            Final rates may differ based on underwriting and medical
            examinations
          </li>
          <li>
            We make no guarantees about insurance approval or specific rates
          </li>
          <li>Product availability varies by state and insurance carrier</li>
        </ul>

        <h2>Use of Website</h2>
        <p>
          You may use our website for lawful purposes only. You agree not to:
        </p>
        <ul>
          <li>Provide false or misleading information</li>
          <li>Attempt to gain unauthorized access to our systems</li>
          <li>
            Use the website in any way that could damage or impair its
            functionality
          </li>
          <li>Transmit any harmful code, viruses, or malicious software</li>
          <li>Violate any applicable laws or regulations</li>
        </ul>

        <h2>Privacy and Data Protection</h2>
        <p>
          Your privacy is important to us. Please review our
          <NuxtLink
            href="/privacy-policy"
            class="text-blue-600 hover:text-blue-800 underline dark:text-blue-400"
            >Privacy Policy</NuxtLink
          >
          to understand how we collect, use, and protect your personal
          information.
        </p>

        <h2>Communication Consent</h2>
        <p>
          By submitting a quote request or providing your contact information,
          you consent to being contacted by Mowry Agency or our licensed
          representatives via:
        </p>
        <ul>
          <li>Phone calls (including automated/pre-recorded messages)</li>
          <li>Text messages (SMS)</li>
          <li>Email communications</li>
        </ul>
        <p>
          This consent applies even if your phone number is on a Do Not Call
          registry. You may opt out of communications at any time by contacting
          us directly.
        </p>

        <h2>Intellectual Property</h2>
        <p>
          The content, design, and functionality of this website are owned by
          Mowry Digital Enterprise LLC and are protected by copyright and other
          intellectual property laws. You may not reproduce, distribute, or
          create derivative works without our written permission.
        </p>

        <h2>Third-Party Links</h2>
        <p>
          Our website may contain links to third-party websites or services. We
          are not responsible for the content, privacy practices, or terms of
          use of these external sites.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, Mowry Agency and Mowry Digital
          Enterprise LLC shall not be liable for any indirect, incidental,
          special, or consequential damages arising from your use of our website
          or services.
        </p>

        <h2>Insurance Disclaimers</h2>
        <h3>Important Insurance Disclosures:</h3>
        <ul>
          <li>
            <strong>Independent Agency:</strong> We are not affiliated with or
            endorsed by any government agency
          </li>
          <li>
            <strong>Product Variations:</strong> Insurance products and features
            vary by state and carrier
          </li>
          <li>
            <strong>Tax Advantages:</strong> Tax benefits may vary based on
            individual circumstances - consult a tax professional
          </li>
          <li>
            <strong>Health Requirements:</strong> Most life insurance requires
            medical underwriting
          </li>
          <li>
            <strong>Guarantees:</strong> Policy guarantees are subject to the
            claims-paying ability of the issuing insurance company
          </li>
        </ul>

        <h2>Compliance and Regulations</h2>
        <p>
          Our services are subject to state insurance laws and regulations. We
          comply with:
        </p>
        <ul>
          <li>State insurance advertising and marketing regulations</li>
          <li>Telephone Consumer Protection Act (TCPA)</li>
          <li>CAN-SPAM Act for email communications</li>
          <li>State privacy and data protection laws</li>
        </ul>

        <h2>Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. Changes will
          be posted on this page with an updated "Last updated" date. Your
          continued use of our services constitutes acceptance of any changes.
        </p>

        <h2>Governing Law</h2>
        <p>
          These terms are governed by the laws of the state where our principal
          office is located, without regard to conflict of law principles.
        </p>

        <h2>Contact Information</h2>
        <p>
          If you have questions about these Terms of Service, please contact us:
        </p>
        <div class="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg">
          <p>
            <strong>Mowry Agency</strong><br />
            Owned and operated by Mowry Digital Enterprise LLC
          </p>
          <p>
            Email:
            <a
              :href="`mailto:${config.public.agencyEmail}`"
              class="text-blue-600 hover:text-blue-800 dark:text-blue-400"
              >{{ config.public.agencyEmail }}</a
            ><br />
            Phone:
            <a
              :href="`tel:+1${cleanPhone}`"
              class="text-blue-600 hover:text-blue-800 dark:text-blue-400"
              >{{ config.public.agencyPhone }}</a
            >
          </p>
          <p class="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
            National Producer Number (NPN): 16357772
          </p>
        </div>
      </div>
    </Container>
  </SimpleLayout>
</template>

<script setup lang="ts">
import SimpleLayout from '~/components/SimpleLayout.vue';
import Container from '~/components/Container.vue';

const config = useRuntimeConfig();
const agencyPhone = config.public.agencyPhone as string;
const cleanPhone = agencyPhone.replace(/[^\d]/g, '');

const lastUpdated = 'October 14, 2025';

// Set page metadata
useSeoMeta({
  title: 'Terms of Service - Mowry Agency',
  description:
    'Terms and conditions for using Mowry Agency website and services. Important legal information about our life insurance services.',
  keywords:
    'terms of service, legal terms, Mowry Agency, life insurance terms, user agreement',
});
</script>
