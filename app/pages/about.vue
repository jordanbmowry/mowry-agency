<template>
  <Container ref="aboutParent" class="mt-16 sm:mt-32">
    <div
      ref="aboutGridParent"
      class="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12"
    >
      <div ref="imageParent" class="lg:pl-20">
        <div class="max-w-xs px-2.5 lg:max-w-none group">
          <NuxtImg
            src="/images/agency/ignite_image.jpg"
            alt="Mowry Agency - Igniting Financial Security"
            class="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800 transition-all duration-500 group-hover:rotate-6 group-hover:scale-105 shadow-lg group-hover:shadow-xl"
            loading="lazy"
            sizes="xs:320px sm:640px md:768px lg:384px xl:384px"
          />
        </div>
      </div>
      <div ref="contentParent" class="lg:order-first lg:row-span-2">
        <h1
          class="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100"
        >
          We're Mowry Agency. We believe every family deserves financial peace
          of mind.
        </h1>
        <div
          ref="textParent"
          class="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400"
        >
          <p>
            At Mowry Agency, we understand that life insurance is not just a
            policy; it's a commitment to protect your loved ones and help secure
            their future. Founded on the principle that every family deserves
            comprehensive financial protection, we've dedicated ourselves to
            making life insurance accessible, understandable, and affordable for
            families across America.
          </p>
          <p>
            Our journey began with a simple realization: too many families were
            underinsured or completely unprotected because traditional insurance
            felt complicated and overwhelming. We set out to change that by
            creating an agency that puts education and personalized service at
            the heart of everything we do.
          </p>
          <p>
            Today, we specialize in a comprehensive range of life insurance
            solutions including Term Life, Whole Life, Indexed Universal Life,
            Mortgage Protection, Final Expense, and Annuities. Our experienced
            team of licensed professionals takes the time to understand your
            unique situation and goals, providing personalized recommendations
            that fit your lifestyle and budget.
          </p>
          <p>
            What sets us apart is our commitment to ongoing support. We don't
            just sell you a policy and disappear. We're here for you throughout
            your insurance journey, ensuring you have the support you need when
            life changes and when your family needs it most. Because at Mowry
            Agency,
            <em>your family's security is our mission</em>.
          </p>
        </div>
      </div>
      <div class="lg:pl-20">
        <ul role="list" class="space-y-4">
          <li class="flex">
            <a
              :href="`tel:+1${cleanPhone}`"
              class="group flex text-sm font-medium text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"
            >
              <Icon
                name="heroicons:phone"
                class="h-6 w-6 flex-none text-zinc-500 transition group-hover:text-teal-500"
              />
              <span class="ml-4">Call {{ agencyPhone }}</span>
            </a>
          </li>
          <li class="flex">
            <a
              :href="`mailto:${agencyEmail}`"
              class="group flex text-sm font-medium text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"
            >
              <Icon
                name="heroicons:envelope"
                class="h-6 w-6 flex-none text-zinc-500 transition group-hover:text-teal-500"
              />
              <span class="ml-4">{{ agencyEmail }}</span>
            </a>
          </li>
          <li
            class="flex border-t border-zinc-100 pt-8 dark:border-zinc-700/40"
          >
            <a
              href="https://calendly.com/mowry-agency/life-insurance-appointment-phone"
              target="_blank"
              rel="noopener noreferrer"
              class="group flex text-sm font-medium text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"
            >
              <Icon
                name="heroicons:calendar-days"
                class="h-6 w-6 flex-none text-zinc-500 transition group-hover:text-teal-500"
              />
              <span class="ml-4">Schedule Consultation</span>
            </a>
          </li>
        </ul>
      </div>
    </div>

    <!-- Our Values Section -->
    <div class="mt-24 sm:mt-32">
      <div class="mx-auto max-w-2xl lg:max-w-none">
        <h2
          class="text-3xl font-bold tracking-tight text-zinc-800 sm:text-4xl dark:text-zinc-100"
        >
          Our Core Values
        </h2>
        <div
          class="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <!-- Relationships Matter, People Come First -->
          <div class="flex flex-col">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20 mb-4"
            >
              <Icon
                name="heroicons:heart"
                class="h-6 w-6 text-blue-600 dark:text-blue-400"
              />
            </div>
            <h3 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Relationships Matter, People Come First
            </h3>
            <p class="mt-2 text-zinc-600 dark:text-zinc-400">
              This value focuses on building strong connections and prioritizing
              people in their professional and personal lives.
            </p>
          </div>

          <!-- Relentless Pursuit of Personal Growth -->
          <div class="flex flex-col">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 dark:bg-green-900/20 mb-4"
            >
              <Icon
                name="heroicons:academic-cap"
                class="h-6 w-6 text-green-600 dark:text-green-400"
              />
            </div>
            <h3 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Relentless Pursuit of Personal Growth
            </h3>
            <p class="mt-2 text-zinc-600 dark:text-zinc-400">
              The company encourages continuous learning and self-improvement
              for its agents and staff.
            </p>
          </div>

          <!-- Open, Honest, and Productive Communication -->
          <div class="flex flex-col">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-900/20 mb-4"
            >
              <Icon
                name="heroicons:envelope"
                class="h-6 w-6 text-purple-600 dark:text-purple-400"
              />
            </div>
            <h3 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Open, Honest, and Productive Communication
            </h3>
            <p class="mt-2 text-zinc-600 dark:text-zinc-400">
              They strive for clear, truthful, and effective communication
              within the organization.
            </p>
          </div>

          <!-- We Do the Right Thing -->
          <div class="flex flex-col">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-900/20 mb-4"
            >
              <Icon
                name="heroicons:scale"
                class="h-6 w-6 text-orange-600 dark:text-orange-400"
              />
            </div>
            <h3 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              We Do the Right Thing
            </h3>
            <p class="mt-2 text-zinc-600 dark:text-zinc-400">
              This principle highlights integrity and ethical conduct, even when
              not under observation.
            </p>
          </div>

          <!-- We Act Like Owners -->
          <div class="flex flex-col">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/20 mb-4"
            >
              <Icon
                name="heroicons:building-office"
                class="h-6 w-6 text-indigo-600 dark:text-indigo-400"
              />
            </div>
            <h3 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              We Act Like Owners
            </h3>
            <p class="mt-2 text-zinc-600 dark:text-zinc-400">
              Employees are encouraged to take ownership and responsibility for
              their work and the company's success.
            </p>
          </div>

          <!-- We Work as a True Team -->
          <div class="flex flex-col">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 dark:bg-teal-900/20 mb-4"
            >
              <Icon
                name="heroicons:users"
                class="h-6 w-6 text-teal-600 dark:text-teal-400"
              />
            </div>
            <h3 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              We Work as a True Team
            </h3>
            <p class="mt-2 text-zinc-600 dark:text-zinc-400">
              A collaborative and supportive team environment is a key aspect of
              their culture.
            </p>
          </div>

          <!-- Being of Service and Doing Good in the World -->
          <div class="flex flex-col">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 dark:bg-red-900/20 mb-4"
            >
              <svg
                class="h-6 w-6 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3s-4.5 4.03-4.5 9 2.015 9 4.5 9z"
                />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Being of Service and Doing Good in the World
            </h3>
            <p class="mt-2 text-zinc-600 dark:text-zinc-400">
              They aim to positively impact clients and communities, exemplified
              by initiatives like their National Impact Day.
            </p>
          </div>

          <!-- We Have Fun and We Get Stuff Done -->
          <div class="flex flex-col">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-50 dark:bg-yellow-900/20 mb-4"
            >
              <Icon
                name="heroicons:fire"
                class="h-6 w-6 text-yellow-600 dark:text-yellow-400"
              />
            </div>
            <h3 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              We Have Fun and We Get Stuff Done
            </h3>
            <p class="mt-2 text-zinc-600 dark:text-zinc-400">
              This value combines a positive and enjoyable work environment with
              a focus on achieving goals and productivity.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Call to Action Section -->
    <div class="mt-24 sm:mt-32">
      <div class="mx-auto max-w-2xl text-center">
        <h2
          class="text-3xl font-bold tracking-tight text-zinc-800 sm:text-4xl dark:text-zinc-100"
        >
          Ready to Protect Your Family?
        </h2>
        <p class="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Let's discuss your family's unique needs and find the perfect
          insurance solution together.
        </p>
        <div class="mt-8 flex flex-wrap justify-center gap-4">
          <Button
            href="tel:+19303221962"
            variant="primary"
            class="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Call for Quote
          </Button>
          <Button
            href="https://calendly.com/mowry-agency/life-insurance-appointment-phone"
            variant="secondary"
            class="ring-1 ring-zinc-200 hover:ring-zinc-300 dark:ring-zinc-700 dark:hover:ring-zinc-600"
          >
            Schedule Consultation
          </Button>
        </div>
      </div>
    </div>
  </Container>
</template>

<script setup lang="ts">
import { useAutoAnimate } from '@formkit/auto-animate/vue';
import Container from '~/components/Container.vue';
import AboutSocialLink from '~/components/AboutSocialLink.vue';
import Button from '~/components/Button.vue';

// Auto-animate refs
const [aboutParent] = useAutoAnimate();
const [aboutGridParent] = useAutoAnimate();
const [imageParent] = useAutoAnimate();
const [contentParent] = useAutoAnimate();
const [textParent] = useAutoAnimate();

// Get runtime config for agency contact info
const config = useRuntimeConfig();
const agencyEmail = config.public.agencyEmail as string;
const agencyPhone = config.public.agencyPhone as string;
const cleanPhone = agencyPhone.replace(/[^\d]/g, '');

// Set page metadata
useSeoMeta({
  title: 'About - Mowry Agency',
  description:
    "Learn about Mowry Agency's mission to provide comprehensive life insurance solutions for families. We believe every family deserves financial peace of mind.",
  ogTitle: 'About - Mowry Agency',
  ogDescription:
    "Mowry Agency specializes in life insurance solutions including Term Life, Whole Life, Mortgage Protection, and Retirement Planning. Your family's security is our mission.",
  ogType: 'website',
  ogUrl: 'https://mowryagency.com/about',
  ogImage: '/images/agency/ignite_image.jpg',
  twitterTitle: 'About - Mowry Agency',
  twitterDescription:
    'Comprehensive life insurance solutions for families. We believe every family deserves financial peace of mind.',
  twitterCard: 'summary_large_image',
  twitterImage: '/images/agency/ignite_image.jpg',
});
</script>
