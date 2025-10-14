<template>
  <SimpleLayout
    title="Meet Our Licensed Insurance Agents"
    intro="Our experienced team of licensed insurance professionals is dedicated to helping you find the perfect coverage for your family's unique needs."
  >
    <Container class="mt-16 sm:mt-20">
      <div class="space-y-20">
        <!-- Agent Profiles -->
        <div class="mx-auto max-w-2xl lg:max-w-none">
          <div
            class="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-20"
          >
            <!-- Agent 1 -->
            <div class="flex flex-col items-start">
              <div class="relative">
                <NuxtImg
                  src="/images/agency/bio_image.png"
                  alt="Insurance Agent"
                  class="aspect-square w-64 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
                  width="256"
                  height="256"
                  sizes="256px"
                />
              </div>
              <h2
                class="mt-6 text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100"
              >
                John Mowry
              </h2>
              <p class="mt-2 text-base text-zinc-600 dark:text-zinc-400">
                Senior Insurance Advisor
              </p>
              <p class="mt-4 text-zinc-600 dark:text-zinc-400">
                With over 15 years of experience in the insurance industry, John
                specializes in life insurance and retirement planning. He's
                helped hundreds of families secure their financial future with
                personalized insurance solutions.
              </p>
              <div class="mt-6 flex gap-6">
                <SocialLink
                  :href="`mailto:${agencyEmail}`"
                  :ariaLabel="'Email John'"
                  :icon="MailIcon"
                />
                <SocialLink
                  href="#"
                  :ariaLabel="'Connect on LinkedIn'"
                  :icon="LinkedInIcon"
                />
              </div>
            </div>

            <!-- Agent 2 -->
            <div class="flex flex-col items-start">
              <div class="relative">
                <div
                  class="aspect-square w-64 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center"
                >
                  <span class="text-zinc-400">Agent Photo</span>
                </div>
              </div>
              <h2
                class="mt-6 text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100"
              >
                Sarah Johnson
              </h2>
              <p class="mt-2 text-base text-zinc-600 dark:text-zinc-400">
                Insurance Specialist
              </p>
              <p class="mt-4 text-zinc-600 dark:text-zinc-400">
                Sarah brings 8 years of experience helping young families and
                business owners protect what matters most. She specializes in
                term life insurance and mortgage protection policies.
              </p>
              <div class="mt-6 flex gap-6">
                <SocialLink
                  :href="`mailto:${agencyEmail}`"
                  :ariaLabel="'Email Sarah'"
                  :icon="MailIcon"
                />
                <SocialLink
                  href="#"
                  :ariaLabel="'Connect on LinkedIn'"
                  :icon="LinkedInIcon"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Team Values -->
        <div class="mx-auto max-w-2xl lg:max-w-none">
          <h2
            class="text-2xl font-bold tracking-tight text-zinc-800 sm:text-3xl dark:text-zinc-100"
          >
            Our Commitment to You
          </h2>
          <div
            class="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            <div class="flex flex-col">
              <h3
                class="text-lg font-semibold text-zinc-900 dark:text-zinc-100"
              >
                Personalized Service
              </h3>
              <p class="mt-2 text-zinc-600 dark:text-zinc-400">
                We take the time to understand your unique situation and goals.
              </p>
            </div>
            <div class="flex flex-col">
              <h3
                class="text-lg font-semibold text-zinc-900 dark:text-zinc-100"
              >
                Expert Guidance
              </h3>
              <p class="mt-2 text-zinc-600 dark:text-zinc-400">
                Our licensed professionals provide clear, honest advice you can
                trust.
              </p>
            </div>
            <div class="flex flex-col">
              <h3
                class="text-lg font-semibold text-zinc-900 dark:text-zinc-100"
              >
                Ongoing Support
              </h3>
              <p class="mt-2 text-zinc-600 dark:text-zinc-400">
                We're here for you long after your policy is in place.
              </p>
            </div>
          </div>
        </div>

        <!-- Contact CTA -->
        <div class="mx-auto max-w-2xl text-center">
          <h2
            class="text-2xl font-bold tracking-tight text-zinc-800 sm:text-3xl dark:text-zinc-100"
          >
            Ready to Get Started?
          </h2>
          <p class="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Schedule a free consultation with one of our licensed agents today.
          </p>
          <div class="mt-8 flex flex-wrap justify-center gap-4">
            <Button
              href="https://calendly.com/mowry-agency/life-insurance-appointment-phone"
              variant="primary"
              class="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Schedule Consultation
            </Button>
            <Button
              href="/quote"
              variant="secondary"
              class="ring-1 ring-zinc-200 hover:ring-zinc-300 dark:ring-zinc-700 dark:hover:ring-zinc-600"
            >
              Get Quote
            </Button>
          </div>
        </div>
      </div>
    </Container>
  </SimpleLayout>
</template>

<script setup lang="ts">
import SimpleLayout from '~/components/SimpleLayout.vue';
import Container from '~/components/Container.vue';
import Button from '~/components/Button.vue';
import SocialLink from '~/components/SocialLink.vue';
import MailIcon from '~/components/icons/MailIcon.vue';
import LinkedInIcon from '~/components/icons/LinkedInIcon.vue';

// Get runtime config for agency contact info
const config = useRuntimeConfig();
const agencyEmail = config.public.agencyEmail as string;

// Set page metadata
useSeoMeta({
  title: 'Licensed Insurance Agents - Mowry Agency',
  description:
    'Meet our experienced team of licensed insurance professionals. Get personalized service and expert guidance for all your life insurance needs.',
  ogTitle: 'Licensed Insurance Agents - Mowry Agency',
  ogDescription:
    'Experienced licensed insurance professionals providing personalized service and expert guidance.',
});
</script>
