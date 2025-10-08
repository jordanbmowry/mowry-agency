<template>
  <SimpleLayout
    title="Get Your Free Life Insurance Quote"
    intro="Ready to protect what matters most? Get a personalized life insurance quote tailored to your family's specific needs. We'll contact you within 24 hours with competitive rates and comprehensive coverage options designed to secure your legacy."
  >
    <div class="space-y-20">
      <div class="space-y-10">
        <div class="space-y-6">
          <h2
            class="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-3xl"
          >
            Why Choose Mowry Agency?
          </h2>
          <div
            class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 text-sm text-zinc-600 dark:text-zinc-400"
          >
            <div class="space-y-2">
              <h3 class="font-semibold text-zinc-800 dark:text-zinc-100">
                🛡️ Life Insurance Expertise
              </h3>
              <p>
                Specializing in term life, whole life, and indexed universal
                life insurance to protect your family's future.
              </p>
            </div>
            <div class="space-y-2">
              <h3 class="font-semibold text-zinc-800 dark:text-zinc-100">
                💰 Tax-Free Wealth Building
              </h3>
              <p>
                Build legacy wealth with tax-advantaged life insurance
                strategies that grow your money while protecting your loved
                ones.
              </p>
            </div>
            <div class="space-y-2">
              <h3 class="font-semibold text-zinc-800 dark:text-zinc-100">
                🎯 Personal Service
              </h3>
              <p>
                Get dedicated support from licensed agents who understand your
                unique situation and family protection needs.
              </p>
            </div>
            <div class="space-y-2">
              <h3 class="font-semibold text-zinc-800 dark:text-zinc-100">
                ⚡ Quick Response
              </h3>
              <p>
                We respond to all quote requests within 24 hours, often much
                sooner during business hours.
              </p>
            </div>
            <div class="space-y-2">
              <h3 class="font-semibold text-zinc-800 dark:text-zinc-100">
                � Multiple Options
              </h3>
              <p>
                From mortgage protection to retirement planning, we offer
                diverse solutions to meet every family's needs.
              </p>
            </div>
            <div class="space-y-2">
              <h3 class="font-semibold text-zinc-800 dark:text-zinc-100">
                🏆 Trusted Legacy Building
              </h3>
              <p>
                Years of experience helping families build lasting legacies and
                secure their financial futures.
              </p>
            </div>
          </div>
        </div>

        <div class="border-t border-zinc-100 pt-10 dark:border-zinc-700/40">
          <div class="space-y-6">
            <h2
              class="text-xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100"
            >
              Life Insurance Solutions We Offer
            </h2>
            <div
              class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 text-sm text-zinc-600 dark:text-zinc-400"
            >
              <div class="flex items-start space-x-3">
                <span class="text-blue-600 dark:text-blue-400">�</span>
                <div>
                  <h3 class="font-semibold text-zinc-800 dark:text-zinc-100">
                    Term Life Insurance
                  </h3>
                  <p>
                    Affordable coverage for specific time periods - perfect for
                    young families
                  </p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <span class="text-blue-600 dark:text-blue-400">💎</span>
                <div>
                  <h3 class="font-semibold text-zinc-800 dark:text-zinc-100">
                    Whole Life Insurance
                  </h3>
                  <p>
                    Permanent coverage with guaranteed cash value growth and
                    lifetime protection
                  </p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <span class="text-blue-600 dark:text-blue-400">�</span>
                <div>
                  <h3 class="font-semibold text-zinc-800 dark:text-zinc-100">
                    Indexed Universal Life (IUL)
                  </h3>
                  <p>
                    Build tax-free wealth with market-linked growth potential
                    and flexible premiums
                  </p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <span class="text-blue-600 dark:text-blue-400">🏠</span>
                <div>
                  <h3 class="font-semibold text-zinc-800 dark:text-zinc-100">
                    Mortgage Protection
                  </h3>
                  <p>
                    Ensure your family can keep their home if something happens
                    to you
                  </p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <span class="text-blue-600 dark:text-blue-400">⚰️</span>
                <div>
                  <h3 class="font-semibold text-zinc-800 dark:text-zinc-100">
                    Final Expense Insurance
                  </h3>
                  <p>
                    Cover burial costs and final expenses without burdening your
                    family
                  </p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <span class="text-blue-600 dark:text-blue-400">💰</span>
                <div>
                  <h3 class="font-semibold text-zinc-800 dark:text-zinc-100">
                    Annuities
                  </h3>
                  <p>
                    Guaranteed retirement income and tax-deferred growth for
                    your golden years
                  </p>
                </div>
              </div>
            </div>

            <div class="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <h3
                class="text-sm font-semibold text-blue-800 dark:text-blue-300"
              >
                Ready to Secure Your Legacy?
              </h3>
              <p class="mt-1 text-sm text-blue-700 dark:text-blue-400">
                Call us at
                <a
                  href="tel:9303221962"
                  class="font-semibold underline decoration-blue-500 underline-offset-2"
                >
                  (930) 322-1962
                </a>
                for immediate assistance or questions about protecting your
                family's financial future.
              </p>
            </div>
          </div>
        </div>

        <!-- Quote Form Section -->
        <div class="border-t border-zinc-100 pt-10 dark:border-zinc-700/40">
          <div class="max-w-2xl mx-auto">
            <QuoteForm />
          </div>
        </div>

        <div class="border-t border-zinc-100 pt-10 dark:border-zinc-700/40">
          <div class="text-center space-y-6">
            <h2
              class="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100"
            >
              Building Legacy Wealth That Lasts
            </h2>
            <p
              class="text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto"
            >
              We don't just sell insurance - we help families build lasting
              legacies. Our tax-free wealth building strategies have helped
              countless families secure their financial futures while protecting
              what matters most.
            </p>
          </div>
        </div>
      </div>
    </div>
  </SimpleLayout>
</template>

<script setup lang="ts">
import SimpleLayout from '../components/SimpleLayout.vue';
import QuoteForm from '../components/QuoteForm.vue';

useSeoMeta({
  title: 'Get Your Free Life Insurance Quote - Mowry Agency',
  description:
    'Get a personalized life insurance quote from Mowry Agency. Specializing in term life, whole life, IUL, and annuities. Build tax-free wealth while protecting your family. Quick response within 24 hours.',
  keywords:
    'life insurance quote, term life insurance, whole life insurance, indexed universal life, IUL, annuities, mortgage protection, final expense, tax-free wealth building',
});
</script>
