<!-- Customer Confirmation Email Template -->
<template>
  <Html>
    <Head>
      <title>Thank You - Mowry Agency</title>
    </Head>
    <Body
      style="
        background-color: #f6f9fc;
        margin: 0;
        padding: 0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      "
    >
      <Container
        style="
          background-color: #ffffff;
          margin: 0 auto;
          padding: 0;
          max-width: 600px;
        "
      >
        <!-- Header -->
        <Section
          style="background-color: #1e40af; padding: 20px; text-align: center"
        >
          <Img
            src="https://mowryagency.com/images/Mowry_Agency_Logo.png"
            alt="Mowry Agency"
            width="60"
            height="60"
            style="margin-bottom: 10px"
          />
          <Heading style="color: #ffffff; margin: 0; font-size: 24px">
            Thank You for Your Interest!
          </Heading>
        </Section>

        <!-- Content -->
        <Section style="padding: 30px">
          <Text style="font-size: 18px; color: #1f2937; margin-bottom: 10px">
            Dear {{ customerData.firstName }},
          </Text>

          <Text
            style="
              font-size: 16px;
              color: #374151;
              line-height: 1.6;
              margin-bottom: 20px;
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
