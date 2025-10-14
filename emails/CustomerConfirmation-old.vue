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
  Tailwind 
} from '@vue-email/components'

// Define props for the email template
defineProps<{
  customerData: {
    firstName: string
    email: string
    coverageType: string
  }
  agencyEmail: string
  unsubscribeLink: string
}>()

// Simplified Tailwind config for emails
const emailTailwindConfig = {
  theme: {
    extend: {
      colors: {
        brand: {
          600: '#2563eb',
          700: '#1d4ed8',
        }
      }
    }
  }
}
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
              We've received your request for <strong>{{ customerData.coverageType }}</strong> coverage 
              and are excited to help protect what matters most to your family.
            </Text>

            <Text class="text-base text-zinc-600 leading-relaxed mb-6">
              Our licensed insurance specialists will review your information and contact you within 
              <strong>24 hours</strong> to discuss your coverage options and answer any questions you may have.
            </Text>

            <!-- What's Next Section -->
            <Section class="bg-zinc-50 p-6 rounded-lg mb-6">
              <Heading class="text-xl font-bold text-zinc-900 mb-4">
                What's Next?
              </Heading>
              
              <Text class="text-sm text-zinc-600 mb-2">
                • We'll review your information and prepare personalized coverage options
              </Text>
              <Text class="text-sm text-zinc-600 mb-2">
                • One of our licensed agents will call you to discuss your needs
              </Text>
              <Text class="text-sm text-zinc-600 mb-2">
                • We'll provide you with competitive quotes from top-rated carriers
              </Text>
              <Text class="text-sm text-zinc-600">
                • You'll receive a customized proposal tailored to your family's needs
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
              We're committed to helping families build lasting legacies through smart insurance planning. 
              Thank you for considering Mowry Agency for your insurance needs.
            </Text>

            <Text class="text-sm text-zinc-500 mt-4">
              Best regards,<br>
              <strong>The Mowry Agency Team</strong><br>
              Licensed Insurance Professionals
            </Text>

            <!-- Unsubscribe -->
            <Hr class="border-zinc-200 my-6" />
            
            <Text class="text-xs text-zinc-400 text-center">
              This email was sent to {{ customerData.email }} because you requested a quote from Mowry Agency.
              <br>
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
            "
          >
            Thank you for reaching out to Mowry Agency for your insurance needs.
            We have received your request for information about
            <strong>{{ customerData.coverageType }}</strong> coverage.
          </Text>

          <!-- What's Next Section -->
          <Section
            style="
              background-color: #ecfdf5;
              padding: 20px;
              border-radius: 8px;
              border-left: 4px solid #10b981;
              margin: 20px 0;
            "
          >
            <Heading style="color: #065f46; font-size: 18px; margin-top: 0">
              What Happens Next?
            </Heading>

            <ul style="color: #374151; padding-left: 20px; margin: 0">
              <li style="margin-bottom: 8px">
                One of our licensed agents will review your information
              </li>
              <li style="margin-bottom: 8px">
                We'll contact you within 24 hours to discuss your needs
              </li>
              <li style="margin-bottom: 8px">
                We'll provide you with personalized quotes from our top-rated
                carriers
              </li>
            </ul>
          </Section>

          <!-- Contact Information -->
          <Section
            style="
              background-color: #f8fafc;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            "
          >
            <Heading style="color: #1f2937; font-size: 18px; margin-top: 0">
              Questions? We're Here to Help
            </Heading>

            <Text style="color: #374151; margin-bottom: 15px">
              If you have any immediate questions, please don't hesitate to
              contact us:
            </Text>

            <Row>
              <Column>
                <Link
                  href="tel:+19303221962"
                  style="
                    color: #1e40af;
                    text-decoration: none;
                    font-weight: 600;
                  "
                >
                  📞 {{ agencyPhone }}
                </Link>
              </Column>
            </Row>
            <Row>
              <Column>
                <Link
                  href="mailto:mowryagency@gmail.com"
                  style="
                    color: #1e40af;
                    text-decoration: none;
                    font-weight: 600;
                  "
                >
                  ✉️ {{ agencyEmail }}
                </Link>
              </Column>
            </Row>
          </Section>

          <!-- Why Choose Us -->
          <Section style="margin: 30px 0">
            <Heading style="color: #1f2937; font-size: 18px">
              Why Choose Mowry Agency?
            </Heading>

            <Row>
              <Column>
                <Text style="color: #374151; margin: 5px 0">
                  ✅ <strong>A+ Rated Carriers</strong> - We work with only the
                  most reliable insurance companies
                </Text>
                <Text style="color: #374151; margin: 5px 0">
                  ✅ <strong>Competitive Rates</strong> - We shop multiple
                  carriers to find you the best price
                </Text>
                <Text style="color: #374151; margin: 5px 0">
                  ✅ <strong>Licensed Professionals</strong> - Our agents are
                  fully licensed and experienced
                </Text>
                <Text style="color: #374151; margin: 5px 0">
                  ✅ <strong>Personal Service</strong> - We're committed to
                  providing exceptional customer care
                </Text>
              </Column>
            </Row>
          </Section>
        </Section>

        <!-- Footer -->
        <Section
          style="
            background-color: #f8fafc;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
          "
        >
          <Text style="color: #1f2937; font-weight: 600; margin-bottom: 10px">
            Mowry Agency - Protecting What Matters Most
          </Text>
          <Text style="color: #6b7280; font-size: 14px; margin: 5px 0">
            Licensed Insurance Agency | {{ agencyPhone }}
          </Text>
          <Text style="color: #6b7280; font-size: 14px; margin: 5px 0">
            {{ agencyAddress }}
          </Text>

          <!-- CAN-SPAM Compliance Section -->
          <Section
            style="
              margin-top: 20px;
              padding-top: 15px;
              border-top: 1px solid #e5e7eb;
            "
          >
            <Text style="color: #6b7280; font-size: 12px; margin: 5px 0">
              This email was sent because you requested information from Mowry
              Agency.
            </Text>
            <Text style="color: #6b7280; font-size: 12px; margin: 5px 0">
              If you no longer wish to receive emails from us, you may
              <Link
                href="{{ unsubscribeLink }}"
                style="color: #1e40af; text-decoration: underline"
              >
                unsubscribe here </Link
              >.
            </Text>
            <Text style="color: #6b7280; font-size: 12px; margin: 10px 0 0 0">
              Licensed Agent: Jordan Mowry | NPN: 16357772
            </Text>
          </Section>
        </Section>
      </Container>
    </Body>
  </Html>
</template>

<script setup lang="ts">
interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  coverageType: string;
}

interface Props {
  customerData: CustomerData;
  agencyEmail: string;
  agencyPhone: string;
  agencyAddress: string;
  unsubscribeLink: string;
}

defineProps<Props>();
</script>
