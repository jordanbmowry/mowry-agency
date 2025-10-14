<template>
  <SimpleLayout
    title="Privacy Policy"
    intro="How we collect, use, and protect your personal information."
  >
    <Container>
      <div class="prose prose-zinc dark:prose-invert max-w-none">
        <p class="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
          Last updated: {{ lastUpdated }}
        </p>

        <h2>Information We Collect</h2>
        <p>
          When you use our services, we may collect the following types of
          information:
        </p>
        <ul>
          <li>
            <strong>Personal Information:</strong> Name, email address, phone
            number, date of birth, and other contact details you provide
          </li>
          <li>
            <strong>Health Information:</strong> Medical conditions,
            medications, and health-related information for insurance quotes.
            This information is collected solely for underwriting purposes and
            is protected with enhanced security measures similar to HIPAA
            standards.
          </li>
          <li>
            <strong>Financial Information:</strong> Coverage preferences,
            financial goals, and insurance needs
          </li>
          <li>
            <strong>Technical Information:</strong> IP address, browser type,
            device information, and usage data
          </li>
        </ul>

        <h2>How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul>
          <li>
            Provide personalized life insurance quotes and recommendations
          </li>
          <li>Contact you about insurance products and services</li>
          <li>Process your insurance applications and claims</li>
          <li>Improve our website and services</li>
          <li>Comply with legal and regulatory requirements</li>
          <li>Send you marketing communications (with your consent)</li>
        </ul>

        <h2>Information Sharing</h2>
        <p>We may share your information with:</p>
        <ul>
          <li>
            <strong>Insurance Carriers:</strong> To obtain quotes and process
            applications
          </li>
          <li>
            <strong>Service Providers:</strong> Third-party vendors who help us
            operate our business
          </li>
          <li>
            <strong>Legal Requirements:</strong> When required by law or to
            protect our rights
          </li>
          <li>
            <strong>Business Transfers:</strong> In connection with a sale or
            merger of our business
          </li>
        </ul>
        <p>
          <strong
            >We do not sell your personal information to third parties for
            marketing purposes.</strong
          >
        </p>

        <h2>Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to
          protect your personal information against unauthorized access,
          alteration, disclosure, or destruction. This includes:
        </p>
        <ul>
          <li>SSL encryption for data transmission</li>
          <li>Secure data storage with encryption at rest</li>
          <li>Regular security assessments and updates</li>
          <li>
            Limited access to personal information on a need-to-know basis
          </li>
          <li>
            <strong>Enhanced Health Information Protection:</strong> Medical and
            health data is subject to additional security protocols and is only
            accessed by authorized personnel for legitimate underwriting
            purposes
          </li>
        </ul>

        <h2>Your Rights</h2>
        <p>Depending on your location, you may have the right to:</p>
        <ul>
          <li>Access the personal information we hold about you</li>
          <li>Request correction of inaccurate information</li>
          <li>Request deletion of your personal information</li>
          <li>Object to or restrict processing of your information</li>
          <li>Withdraw consent for marketing communications</li>
          <li>Data portability (receive a copy of your data)</li>
        </ul>

        <h2>Cookies and Tracking</h2>
        <p>
          Our website uses cookies and similar technologies to improve your
          experience and analyze website usage. You can control cookie settings
          through your browser preferences.
        </p>

        <h2>Third-Party Links</h2>
        <p>
          Our website may contain links to third-party websites. We are not
          responsible for the privacy practices of these external sites.
        </p>

        <h2>Children's Privacy</h2>
        <p>
          Our services are not intended for children under 18. We do not
          knowingly collect personal information from minors.
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify
          you of any material changes by posting the new policy on our website
          and updating the "Last updated" date.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy or how we handle
          your personal information, please contact us:
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
  title: 'Privacy Policy - Mowry Agency',
  description:
    'Learn how Mowry Agency collects, uses, and protects your personal information. Our commitment to data privacy and security.',
  keywords:
    'privacy policy, data protection, personal information, Mowry Agency, life insurance privacy',
});
</script>
