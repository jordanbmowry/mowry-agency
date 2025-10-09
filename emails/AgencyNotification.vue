<!-- Agency Notification Email Template -->
<template>
  <Html>
    <Head>
      <title>New Quote Request - Mowry Agency</title>
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
            New Quote Request
          </Heading>
        </Section>

        <!-- Content -->
        <Section style="padding: 30px">
          <Text style="font-size: 16px; color: #374151; margin-bottom: 20px">
            You have received a new insurance quote request from your website.
          </Text>

          <!-- Contact Information -->
          <Section
            style="
              background-color: #f8fafc;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 20px;
            "
          >
            <Heading style="color: #1f2937; font-size: 18px; margin-top: 0">
              Contact Information
            </Heading>

            <Row>
              <Column>
                <Text style="margin: 5px 0; color: #374151">
                  <strong>Name:</strong> {{ leadData.firstName }}
                  {{ leadData.lastName }}
                </Text>
                <Text style="margin: 5px 0; color: #374151">
                  <strong>Email:</strong> {{ leadData.email }}
                </Text>
                <Text style="margin: 5px 0; color: #374151">
                  <strong>Phone:</strong> {{ leadData.phone }}
                </Text>
                <Text style="margin: 5px 0; color: #374151">
                  <strong>Coverage Type:</strong> {{ leadData.coverageType }}
                </Text>
              </Column>
            </Row>
          </Section>

          <!-- Message -->
          <Section v-if="leadData.message" style="margin-bottom: 20px">
            <Heading style="color: #1f2937; font-size: 18px">
              Additional Information
            </Heading>
            <Text
              style="
                background-color: #f8fafc;
                padding: 15px;
                border-radius: 8px;
                color: #374151;
                white-space: pre-wrap;
              "
            >
              {{ leadData.message }}
            </Text>
          </Section>

          <!-- Action Button -->
          <Section style="text-align: center; margin: 30px 0">
            <Button
              :href="`mailto:${leadData.email}?subject=Re: Your Insurance Quote Request`"
              style="
                background-color: #1e40af;
                color: #ffffff;
                padding: 12px 24px;
                border-radius: 6px;
                text-decoration: none;
                font-weight: 600;
              "
            >
              Reply to Lead
            </Button>
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
          <Text style="color: #6b7280; font-size: 14px; margin: 0">
            This lead was generated from the Mowry Agency website contact form.
          </Text>
          <Text style="color: #6b7280; font-size: 12px; margin: 10px 0 0 0">
            Mowry Agency | (930) 322-1962 | mowryagency@gmail.com
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
</template>

<script setup lang="ts">
interface LeadData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  coverageType: string;
  message?: string;
}

interface Props {
  leadData: LeadData;
}

defineProps<Props>();
</script>
