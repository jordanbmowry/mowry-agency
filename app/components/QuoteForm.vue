<template>
  <div class="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
    <!-- Thank You Message - Shown if form was already submitted -->
    <div v-if="isMounted && quoteFormSubmitted" class="space-y-6">
      <div class="text-center space-y-4">
        <div class="flex justify-center mb-4">
          <Icon
            name="heroicons:check-circle"
            class="h-16 w-16 text-green-600 dark:text-green-400"
          />
        </div>
        <h2 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Thank You for Your Quote Request!
        </h2>
        <p class="text-zinc-600 dark:text-zinc-400">
          Hi <span class="font-semibold">{{ submittedUserName }}</span
          >, we've received your quote request and will contact you within 24
          hours with a personalized life insurance quote.
        </p>
      </div>

      <div
        class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-3"
      >
        <h3 class="font-semibold text-blue-900 dark:text-blue-100">
          What happens next?
        </h3>
        <ul class="text-sm text-blue-800 dark:text-blue-200 space-y-2">
          <li class="flex items-start gap-2">
            <Icon name="heroicons:check" class="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span>Our agents will review your information</span>
          </li>
          <li class="flex items-start gap-2">
            <Icon name="heroicons:check" class="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span
              >We'll contact you with personalized quotes from top
              carriers</span
            >
          </li>
          <li class="flex items-start gap-2">
            <Icon name="heroicons:check" class="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span
              >Compare options and choose the best coverage for your
              family</span
            >
          </li>
        </ul>
      </div>

      <div
        class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4"
      >
        <p class="text-sm text-amber-900 dark:text-amber-100">
          <strong>Need to add or change anything?</strong> Please contact us
          directly:
        </p>
        <div class="mt-3 flex flex-col sm:flex-row gap-2">
          <a
            :href="`tel:+1${agencyPhone.replace(/[^\\d]/g, '')}`"
            class="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-md text-sm font-medium transition-colors cursor-pointer"
          >
            <Icon name="heroicons:phone" class="h-4 w-4 mr-2" />
            Call Us
          </a>
          <a
            :href="`sms:+1${agencyPhone.replace(/[^\\d]/g, '')}`"
            class="inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-md text-sm font-medium transition-colors cursor-pointer"
          >
            <Icon name="heroicons:chat-bubble-left" class="h-4 w-4 mr-2" />
            Text Us
          </a>
          <a
            :href="`mailto:${agencyEmail}`"
            class="inline-flex items-center justify-center px-4 py-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-100 rounded-md text-sm font-medium transition-colors cursor-pointer"
          >
            <Icon name="heroicons:envelope" class="h-4 w-4 mr-2" />
            Email Us
          </a>
        </div>
      </div>
    </div>

    <!-- Form - Shown if not yet submitted -->
    <div v-else class="space-y-6">
      <div>
        <h2 class="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          <MailIcon class="h-6 w-6 flex-none" />
          <span class="ml-3">Get Your Free Life Insurance Quote</span>
        </h2>
        <p class="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Ready to protect your family's future? Fill out the form below and
          we'll contact you within 24 hours with a personalized life insurance
          quote.
        </p>
      </div>

      <!-- Progress Bar -->
      <div class="mt-6 mb-8">
        <MultiStepProgressBar
          :current-step="currentStep"
          :is-step1-valid="isStep1Valid"
          :is-step2-valid="isStep2Valid"
          :is-step3-valid="isStep3Valid"
        />
      </div>

      <form
        @submit.prevent="handleSubmit"
        ref="formParent"
        class="mt-6 space-y-6"
      >
        <!-- Step 1: Personal Information Section -->
        <div
          v-if="currentStep === 1"
          ref="personalInfoParent"
          class="space-y-4"
        >
          <h3
            class="text-sm font-medium text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-700 pb-2"
          >
            Personal Information
          </h3>

          <!-- First and Last Name -->
          <div
            ref="nameFieldsParent"
            class="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <FormInput
              id="firstName"
              label="First Name"
              v-model="form.firstName"
              type="text"
              :required="true"
              :error="errors.firstName"
              placeholder="John"
              color="neutral"
              @blur="validateField('firstName')"
            />
            <FormInput
              id="lastName"
              label="Last Name"
              v-model="form.lastName"
              type="text"
              :required="true"
              :error="errors.lastName"
              placeholder="Doe"
              color="neutral"
              @blur="validateField('lastName')"
            />
          </div>

          <!-- Email and Phone -->
          <div v-auto-animate class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              id="email"
              label="Email Address"
              v-model="form.email"
              type="email"
              :required="true"
              :error="errors.email"
              placeholder="john@example.com"
              color="neutral"
              @blur="validateField('email')"
            />
            <FormInput
              id="phone"
              label="Phone Number"
              v-model="form.phone"
              type="tel"
              :required="true"
              :error="errors.phone"
              placeholder="(555) 123-4567"
              color="neutral"
              @blur="validateField('phone')"
            />
          </div>

          <!-- Date of Birth -->
          <FormInput
            id="dateOfBirth"
            label="Date of Birth"
            v-model="form.dateOfBirth"
            type="date"
            :required="true"
            :error="errors.dateOfBirth"
            :max="maxDate"
            autocomplete="bday"
            color="neutral"
            help-text="Required for accurate life insurance quotes"
            @blur="validateField('dateOfBirth')"
          />

          <!-- Sex -->
          <FormSelect
            id="sex"
            label="Sex"
            v-model="form.sex"
            :required="true"
            :error="errors.sex"
            :options="sexOptions"
            placeholder="Select sex..."
            color="neutral"
            @blur="validateField('sex')"
          />

          <!-- City and State -->
          <div v-auto-animate class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <!-- City -->
            <FormInput
              id="city"
              label="City"
              v-model="form.city"
              type="text"
              :required="true"
              :error="errors.city"
              placeholder="Enter your city"
              color="neutral"
              @blur="validateField('city')"
            />

            <!-- State -->
            <FormSelect
              id="state"
              label="State"
              v-model="form.state"
              :required="true"
              :error="errors.state"
              :options="stateOptions"
              placeholder="Select your state"
              color="neutral"
              help-text="We can only provide quotes in states where we're licensed"
              @blur="validateField('state')"
            />
          </div>
        </div>

        <!-- Step 2: Health Information Section -->
        <div v-if="currentStep === 2" class="space-y-4">
          <div class="flex items-start justify-between">
            <h3
              class="text-sm font-medium text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-700 pb-2 flex-1"
            >
              Health Information
            </h3>
          </div>

          <!-- Health Information Disclaimer -->
          <div
            class="p-3 bg-amber-50 border border-amber-200 rounded-md dark:bg-amber-900/20 dark:border-amber-800"
          >
            <p class="text-xs text-amber-700 dark:text-amber-300">
              <strong>Health Information Privacy:</strong> Medical information
              you provide is securely encrypted and used only for insurance
              underwriting purposes. This information helps us find the most
              accurate rates for your situation and is protected under strict
              privacy guidelines.
            </p>
          </div>

          <!-- Physical Information -->
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <!-- Height -->
            <FormInput
              id="height"
              label="Height"
              v-model="form.height"
              type="number"
              step="0.1"
              :required="true"
              :error="errors.height"
              placeholder="5.5"
              color="neutral"
              help-text="Enter as decimal (e.g., 5.5 for 5'6&quot;)"
              @blur="validateField('height')"
            />

            <!-- Weight -->
            <FormInput
              id="weight"
              label="Weight"
              v-model="form.weight"
              type="number"
              step="0.1"
              :required="true"
              :error="errors.weight"
              placeholder="190.5"
              color="neutral"
              help-text="Enter weight in pounds"
              @blur="validateField('weight')"
            />
          </div>

          <!-- Health Conditions -->
          <FormTextarea
            id="healthConditions"
            label="Current Health Conditions"
            v-model="form.healthConditions"
            :rows="3"
            :error="errors.healthConditions"
            placeholder="Please list any current health conditions, diagnosed illnesses, or ongoing medical concerns. If none, please write 'None'."
            color="neutral"
            help-text="This information helps us find the best rates and is kept strictly confidential"
            @blur="validateField('healthConditions')"
          />

          <!-- Medications -->
          <FormTextarea
            id="medications"
            label="Current Medications"
            v-model="form.medications"
            :rows="3"
            :error="errors.medications"
            placeholder="Please list all current medications including dosages if known. If none, please write 'None'."
            color="neutral"
            help-text="Include prescription medications, over-the-counter drugs, and supplements"
            @blur="validateField('medications')"
          />
        </div>

        <!-- Step 3: Coverage Information Section -->
        <div v-if="currentStep === 3" class="space-y-4">
          <h3
            class="text-sm font-medium text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-700 pb-2"
          >
            Coverage Information
          </h3>

          <!-- Coverage Type -->
          <FormSelect
            id="coverageType"
            label="Type of Coverage Interested In"
            v-model="form.coverageType"
            :required="true"
            :error="errors.coverageType"
            :options="coverageTypeOptions"
            placeholder="Select coverage type..."
            color="neutral"
            help-text="We'll help you find the best coverage type for your needs"
            @blur="validateField('coverageType')"
          />

          <!-- Message -->
          <FormTextarea
            id="message"
            label="Additional Information or Questions"
            v-model="form.message"
            :rows="4"
            placeholder="Tell us about your family's protection needs, coverage amount you're considering, your goals, timeline, or any questions about life insurance..."
            color="neutral"
            help-text="Optional - Any additional details that might help us serve you better"
          />
        </div>

        <!-- TCPA Consent Section - Only shown on final step -->
        <div v-if="currentStep === 3" class="mt-6 space-y-4">
          <!-- Primary TCPA Consent -->
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                id="tcpaConsent"
                v-model="form.tcpaConsent"
                type="checkbox"
                class="w-4 h-4 text-blue-600 bg-white border-zinc-300 rounded focus:ring-blue-500 focus:ring-2 dark:bg-zinc-700 dark:border-zinc-600"
                required
              />
            </div>
            <div class="ml-3 text-sm">
              <label for="tcpaConsent" class="text-zinc-700 dark:text-zinc-300">
                <span class="text-red-500">*</span> {{ tcpaConsentText }}
              </label>
            </div>
          </div>

          <!-- Optional Email Marketing Consent -->
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                id="emailMarketing"
                v-model="form.emailMarketingConsent"
                type="checkbox"
                class="w-4 h-4 text-blue-600 bg-white border-zinc-300 rounded focus:ring-blue-500 focus:ring-2 dark:bg-zinc-700 dark:border-zinc-600"
              />
            </div>
            <div class="ml-3 text-sm">
              <label
                for="emailMarketing"
                class="text-zinc-700 dark:text-zinc-300"
              >
                I would also like to receive periodic marketing emails about new
                products and special offers.
              </label>
            </div>
          </div>

          <!-- Licensing Disclosure -->
          <div
            class="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-md"
          >
            <p class="font-medium mb-1">Licensing Information:</p>
            <p>{{ licensingDisclosure }}</p>
          </div>

          <!-- Links -->
          <div class="mt-2 space-x-4 text-xs">
            <NuxtLink
              href="/privacy-policy"
              class="text-blue-600 hover:text-blue-800 underline dark:text-blue-400 dark:hover:text-blue-300"
            >
              View our Privacy Policy
            </NuxtLink>
            <NuxtLink
              href="/terms-of-service"
              class="text-blue-600 hover:text-blue-800 underline dark:text-blue-400 dark:hover:text-blue-300"
            >
              Terms of Service
            </NuxtLink>
          </div>
        </div>

        <!-- Health Information Privacy Notice -->
        <div
          class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md dark:bg-blue-900/20 dark:border-blue-800"
        >
          <div class="flex items-start space-x-2">
            <div class="text-blue-600 dark:text-blue-400 text-lg">🔒</div>
            <div class="flex-1">
              <h4
                class="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1"
              >
                Your Privacy is Protected
              </h4>
              <p
                class="text-xs text-blue-700 dark:text-blue-300 leading-relaxed"
              >
                Your information is secure and used solely for generating your
                personalized life insurance quote. Health information,
                medications, and personal details are encrypted and protected.
                We do not share or sell your information to third parties.
              </p>
            </div>
          </div>
        </div>

        <!-- Submit Section -->
        <div
          v-auto-animate
          class="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-700"
        >
          <!-- Previous Button -->
          <UButton
            v-if="currentStep > 1"
            type="button"
            @click="previousStep"
            variant="outline"
            color="neutral"
            class="!border-blue-500 !text-blue-600 hover:!bg-blue-50 dark:!border-blue-400 dark:!text-blue-400 dark:hover:!bg-blue-950 cursor-pointer"
          >
            <span v-auto-animate class="flex items-center gap-2">
              <Icon name="heroicons:arrow-left" class="h-4 w-4" />
              Previous
            </span>
          </UButton>

          <!-- Next/Submit Button -->
          <UButton
            v-if="currentStep < 3"
            type="button"
            @click="nextStep"
            :disabled="isSubmitting || !isCurrentStepValid"
            variant="solid"
            color="neutral"
            class="!bg-blue-600 !border-blue-600 !text-white hover:!bg-blue-700 dark:!bg-blue-500 dark:!border-blue-500 dark:hover:!bg-blue-600 cursor-pointer"
          >
            <span v-auto-animate class="flex items-center gap-2">
              Next
              <Icon name="heroicons:arrow-right" class="h-4 w-4" />
            </span>
          </UButton>

          <!-- Final Submit Button -->
          <UButton
            v-if="currentStep === 3"
            type="submit"
            :disabled="isSubmitting || !isCurrentStepValid"
            variant="solid"
            color="neutral"
            class="!bg-blue-600 !border-blue-600 !text-white hover:!bg-blue-700 dark:!bg-blue-500 dark:!border-blue-500 dark:hover:!bg-blue-600 cursor-pointer"
          >
            <span v-auto-animate class="flex items-center gap-2">
              <Icon
                v-if="isSubmitting"
                name="heroicons:arrow-path"
                class="h-4 w-4 animate-spin"
              />
              {{ isSubmitting ? 'Sending...' : 'Get My Quote' }}
            </span>
          </UButton>

          <div v-if="currentStep === 1" class="text-right">
            <p class="text-xs text-zinc-500 dark:text-zinc-400">
              * Required fields
            </p>
            <p class="text-xs text-zinc-500 dark:text-zinc-400">
              Your information is secure and confidential
            </p>
          </div>
        </div>
      </form>

      <!-- Success/Error Messages -->
      <div
        v-if="submitted"
        v-auto-animate
        class="mt-4 p-4 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 shadow-lg animate-in slide-in-from-top duration-500"
      >
        <div class="flex items-center gap-2">
          <Icon
            name="heroicons:check-circle"
            class="h-5 w-5 text-green-600 dark:text-green-400 animate-in zoom-in duration-300 delay-200"
          />
          <p class="text-sm text-green-700 dark:text-green-400">
            Thank you! We'll contact you within 24 hours with your personalized
            quote.
          </p>
        </div>
      </div>

      <div
        v-if="error"
        v-auto-animate
        class="mt-4 p-4 rounded-md animate-in slide-in-from-top duration-500"
        :class="{
          'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700':
            errorType === 'duplicate_email',
          'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700':
            errorType !== 'duplicate_email',
        }"
      >
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0">
            <Icon
              :name="
                errorType === 'duplicate_email'
                  ? 'heroicons:check-circle'
                  : 'heroicons:exclamation-triangle'
              "
              :class="{
                'w-5 h-5 text-green-600 dark:text-green-400':
                  errorType === 'duplicate_email',
                'w-5 h-5 text-red-600 dark:text-red-400':
                  errorType !== 'duplicate_email',
              }"
            />
          </div>
          <div class="flex-1">
            <h3
              class="text-sm font-medium"
              :class="{
                'text-green-800 dark:text-green-200':
                  errorType === 'duplicate_email',
                'text-red-800 dark:text-red-200':
                  errorType !== 'duplicate_email',
              }"
            >
              {{
                errorType === 'duplicate_email'
                  ? "We're Already Working on Your Quote!"
                  : 'Submission Error'
              }}
            </h3>
            <p
              class="mt-1 text-sm"
              :class="{
                'text-green-700 dark:text-green-300':
                  errorType === 'duplicate_email',
                'text-red-700 dark:text-red-300':
                  errorType !== 'duplicate_email',
              }"
            >
              {{ errorMessage }}
            </p>

            <!-- Contact information for duplicate email -->
            <div v-if="errorType === 'duplicate_email'" class="mt-3 space-y-2">
              <div class="flex items-center space-x-4 text-sm">
                <a
                  :href="`tel:+1${agencyPhone.replace(/[^\d]/g, '')}`"
                  class="inline-flex items-center px-3 py-2 border border-orange-300 shadow-sm text-sm font-medium rounded-md text-orange-700 bg-orange-50 hover:bg-orange-100 dark:border-orange-600 dark:text-orange-200 dark:bg-orange-900/20 dark:hover:bg-orange-900/40"
                >
                  <Icon name="heroicons:phone" class="w-4 h-4 mr-2" />
                  Call {{ agencyPhone }}
                </a>
                <a
                  :href="`mailto:${agencyEmail}`"
                  class="inline-flex items-center px-3 py-2 border border-orange-300 shadow-sm text-sm font-medium rounded-md text-orange-700 bg-orange-50 hover:bg-orange-100 dark:border-orange-600 dark:text-orange-200 dark:bg-orange-900/20 dark:hover:bg-orange-900/40"
                >
                  <Icon name="heroicons:envelope" class="w-4 h-4 mr-2" />
                  Email Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useAutoAnimate } from '@formkit/auto-animate/vue';
import { useLocalStorage } from '@vueuse/core';
import MailIcon from './icons/MailIcon.vue';
import MultiStepProgressBar from './MultiStepProgressBar.vue';
import { useStatesData } from '~/composables/useCitiesData';
import {
  calculateAge,
  isValidAge,
  getTodayInputFormat,
  getMaxBirthDate,
  isValidDateString,
} from '~/utils/dateUtils';

// Auto-animate refs
const [formParent] = useAutoAnimate();
const [personalInfoParent] = useAutoAnimate();
const [nameFieldsParent] = useAutoAnimate();

// Multi-step form state
const currentStep = ref(1);
const isMounted = ref(false);

// Local storage for form submission tracking
const quoteFormSubmitted = useLocalStorage('quoteFormSubmitted', false);
const submittedUserName = useLocalStorage('submittedUserName', '');

// Hook to track when component is mounted (for hydration)
onMounted(() => {
  isMounted.value = true;
});

// Get runtime config for agency contact info
const config = useRuntimeConfig();
const agencyPhone = config.public.agencyPhone as string;
const agencyEmail = config.public.agencyEmail as string;

// TCPA compliance text - must match server-side version
const tcpaConsentText =
  'By submitting this form, you consent to receive calls, texts, and emails from Mowry Agency and our licensed agents at the contact information provided. This consent is not required as a condition of purchase. Standard message and data rates may apply. You can unsubscribe at any time.';

// Form options for Nuxt UI components
const { states } = useStatesData();

// Convert states to options format for FormSelect
const stateOptions = computed(() =>
  states.map((state) => ({
    label: state.displayName,
    value: state.code,
  }))
);

// Sex options for FormSelect
const sexOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
];

// Coverage type options for FormSelect
const coverageTypeOptions = [
  { label: 'Term Life Insurance', value: 'term-life' },
  { label: 'Whole Life Insurance', value: 'whole-life' },
  { label: 'Indexed Universal Life (IUL)', value: 'iul' },
  { label: 'Mortgage Protection', value: 'mortgage-protection' },
  { label: 'Final Expense Insurance', value: 'final-expense' },
  { label: 'Not Sure - Need Guidance', value: 'not-sure' },
];

// Agency licensing disclosure
const licensingDisclosure =
  'Mowry Agency is owned by Mowry Digital Enterprise LLC. Licensed to sell life insurance products.';

// Form data structure with enhanced TCPA compliance
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  city: '',
  state: '',
  sex: '',
  height: '',
  weight: '',
  healthConditions: '',
  medications: '',
  coverageType: '',
  message: '',
  tcpaConsent: false,
  emailMarketingConsent: false,
  formVersion: 'v1.2', // Track form version for compliance
});

// Error tracking
const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  city: '',
  state: '',
  sex: '',
  height: '',
  weight: '',
  healthConditions: '',
  medications: '',
  coverageType: '',
});

// Form state
const isSubmitting = ref(false);
const submitted = ref(false);
const error = ref(false);
const errorMessage = ref('');
const errorType = ref('');

// Computed properties
const maxDate = computed(() => {
  return getTodayInputFormat();
});

// Step 1: Personal Information validation
const isStep1Valid = computed(() => {
  const requiredFields = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'dateOfBirth',
    'sex',
    'city',
    'state',
  ];
  const hasRequiredFields = requiredFields.every(
    (field) => (form[field as keyof typeof form] as string).trim() !== ''
  );
  const hasNoErrors = Object.entries(errors)
    .filter(([key]) =>
      [
        'firstName',
        'lastName',
        'email',
        'phone',
        'dateOfBirth',
        'sex',
        'height',
        'weight',
        'city',
        'state',
      ].includes(key)
    )
    .every(([, error]) => error === '');
  return hasRequiredFields && hasNoErrors;
});

// Step 2: Health Information validation
const isStep2Valid = computed(() => {
  const hasHeightAndWeight = form.height !== '' && form.weight !== '';
  const hasHealthInfo = ['healthConditions', 'medications'].every(
    (field) => (form[field as keyof typeof form] as string).trim() !== ''
  );
  const hasNoErrors = Object.entries(errors)
    .filter(([key]) =>
      ['height', 'weight', 'healthConditions', 'medications'].includes(key)
    )
    .every(([, error]) => error === '');
  return hasHeightAndWeight && hasHealthInfo && hasNoErrors;
});

// Step 3: Coverage Information validation
const isStep3Valid = computed(() => {
  const hasRequiredFields =
    (form.coverageType as string).trim() !== '' && form.tcpaConsent === true;
  const hasNoErrors = Object.entries(errors)
    .filter(([key]) => ['coverageType'].includes(key))
    .every(([, error]) => error === '');
  return hasRequiredFields && hasNoErrors;
});

// Current step validation
const isCurrentStepValid = computed(() => {
  if (currentStep.value === 1) return isStep1Valid.value;
  if (currentStep.value === 2) return isStep2Valid.value;
  if (currentStep.value === 3) return isStep3Valid.value;
  return false;
});

const isFormValid = computed(() => {
  return isStep1Valid.value && isStep2Valid.value && isStep3Valid.value;
});

// Validation functions
const validateEmail = (email: string): string => {
  if (!email.trim()) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return '';
};

const validatePhone = (phone: string): string => {
  if (!phone.trim()) return 'Phone number is required';
  const phoneRegex = /^[\+]?[1-9]?[\s\-\.\(\)]?[\d\s\-\.\(\)]{9,15}$/;
  if (!phoneRegex.test(phone)) return 'Please enter a valid phone number';
  return '';
};

const validateName = (name: string, fieldName: string): string => {
  if (!name.trim()) return `${fieldName} is required`;
  if (name.trim().length < 2)
    return `${fieldName} must be at least 2 characters`;
  if (name.trim().length > 50)
    return `${fieldName} must be less than 50 characters`;
  return '';
};

const validateDateOfBirth = (dateOfBirth: string): string => {
  if (!dateOfBirth.trim()) return 'Date of birth is required';

  // Validate date format
  if (!isValidDateString(dateOfBirth)) {
    return 'Please enter a valid date';
  }

  // Check if person is at least 18 years old
  if (!isValidAge(dateOfBirth, 18)) {
    return 'You must be at least 18 years old';
  }

  // Check if age is reasonable (not over 100)
  const age = calculateAge(dateOfBirth);
  if (age > 100) {
    return 'Please enter a valid date of birth';
  }

  return '';
};

const validateHealthConditions = (healthConditions: string): string => {
  if (!healthConditions.trim())
    return 'Please provide health conditions information (write "None" if applicable)';
  if (healthConditions.trim().length < 4)
    return 'Please provide more detailed information or write "None"';
  return '';
};

const validateMedications = (medications: string): string => {
  if (!medications.trim())
    return 'Please provide medications information (write "None" if applicable)';
  if (medications.trim().length < 4)
    return 'Please provide more detailed information or write "None"';
  return '';
};

const validateCoverageType = (coverageType: string): string => {
  if (!coverageType.trim()) return 'Please select a coverage type';
  return '';
};

const validateCity = (city: string): string => {
  if (!city.trim()) return 'City is required';
  if (city.trim().length < 2) return 'Please enter a valid city name';
  if (city.trim().length > 50)
    return 'City name must be less than 50 characters';
  return '';
};

const validateSex = (sex: string): string => {
  if (!sex) return 'Sex is required';
  if (!['male', 'female'].includes(sex)) return 'Please select a valid option';
  return '';
};

const validateHeight = (height: string | number): string => {
  if (!height) return 'Height is required';
  const heightNum = typeof height === 'string' ? parseFloat(height) : height;
  if (isNaN(heightNum)) return 'Please enter a valid height';
  if (heightNum < 4.0 || heightNum > 7.0)
    return 'Height must be between 4\'0" and 7\'0"';
  return '';
};

const validateWeight = (weight: string | number): string => {
  if (!weight) return 'Weight is required';
  const weightNum = typeof weight === 'string' ? parseFloat(weight) : weight;
  if (isNaN(weightNum)) return 'Please enter a valid weight';
  if (weightNum < 50 || weightNum > 500)
    return 'Weight must be between 50 and 500 pounds';
  return '';
};

const validateState = (state: string): string => {
  if (!state.trim()) return 'State is required';
  const validStates = [
    'AL',
    'AR',
    'AZ',
    'CA',
    'CO',
    'CT',
    'FL',
    'GA',
    'IA',
    'ID',
    'IL',
    'IN',
    'MA',
    'MD',
    'MI',
    'MN',
    'MO',
    'MT',
    'NC',
    'NE',
    'NJ',
    'NM',
    'NV',
    'OH',
    'PA',
    'SC',
    'SD',
    'TN',
    'TX',
    'UT',
    'VA',
    'WA',
    'WI',
    'WY',
  ];
  if (!validStates.includes(state)) return 'Please select a valid state';
  return '';
};

// Field validation
const validateField = (fieldName: keyof typeof form) => {
  const value = form[fieldName];

  switch (fieldName) {
    case 'firstName':
      errors.firstName = validateName(value as string, 'First name');
      break;
    case 'lastName':
      errors.lastName = validateName(value as string, 'Last name');
      break;
    case 'email':
      errors.email = validateEmail(value as string);
      break;
    case 'phone':
      errors.phone = validatePhone(value as string);
      break;
    case 'dateOfBirth':
      errors.dateOfBirth = validateDateOfBirth(value as string);
      break;
    case 'sex':
      errors.sex = validateSex(value as string);
      break;
    case 'height':
      errors.height = validateHeight(value as string);
      break;
    case 'weight':
      errors.weight = validateWeight(value as string);
      break;
    case 'city':
      errors.city = validateCity(value as string);
      break;
    case 'state':
      errors.state = validateState(value as string);
      break;
    case 'healthConditions':
      errors.healthConditions = validateHealthConditions(value as string);
      break;
    case 'medications':
      errors.medications = validateMedications(value as string);
      break;
    case 'coverageType':
      errors.coverageType = validateCoverageType(value as string);
      break;
    case 'tcpaConsent':
      // No validation needed for boolean consent
      break;
  }
};

// Validate all fields
const validateAllFields = () => {
  const fieldsToValidate: (keyof typeof form)[] = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'dateOfBirth',
    'sex',
    'height',
    'weight',
    'city',
    'state',
    'healthConditions',
    'medications',
    'coverageType',
  ];

  fieldsToValidate.forEach((field) => validateField(field));

  return Object.values(errors).every((error) => error === '');
};

// Step Navigation
const nextStep = () => {
  if (currentStep.value < 3) {
    // Validate current step before moving forward
    if (!isCurrentStepValid.value) {
      // Validate all fields in current step
      if (currentStep.value === 1) {
        [
          'firstName',
          'lastName',
          'email',
          'phone',
          'dateOfBirth',
          'sex',
          'height',
          'weight',
          'city',
          'state',
        ].forEach((field) => {
          validateField(field as keyof typeof form);
        });
      } else if (currentStep.value === 2) {
        ['height', 'weight', 'healthConditions', 'medications'].forEach(
          (field) => {
            validateField(field as keyof typeof form);
          }
        );
      } else if (currentStep.value === 3) {
        ['coverageType'].forEach((field) => {
          validateField(field as keyof typeof form);
        });
      }
      return;
    }
    currentStep.value++;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

// Form submission
const handleSubmit = async () => {
  if (!validateAllFields()) {
    return;
  }

  isSubmitting.value = true;
  error.value = false;

  try {
    // Send form data to our Nuxt API with enhanced TCPA compliance data
    const response = await $fetch('/api/quote', {
      method: 'POST',
      body: {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        dateOfBirth: form.dateOfBirth,
        sex: form.sex,
        height: form.height,
        weight: form.weight,
        city: form.city,
        state: form.state,
        healthConditions: form.healthConditions,
        medications: form.medications,
        coverageType: form.coverageType,
        message: form.message,
        tcpaConsent: form.tcpaConsent,
        tcpaText: tcpaConsentText,
        emailMarketingConsent: form.emailMarketingConsent,
        formVersion: form.formVersion,
      },
    });

    // Reset form and show success
    Object.keys(form).forEach((key) => {
      if (key === 'tcpaConsent' || key === 'emailMarketingConsent') {
        (form as any)[key] = false;
      } else if (key === 'formVersion') {
        // Keep form version as is
        return;
      } else {
        (form as any)[key] = '';
      }
    });

    // Clear errors
    Object.keys(errors).forEach((key) => {
      errors[key as keyof typeof errors] = '';
    });

    // Store submission in localStorage and advance progress
    quoteFormSubmitted.value = true;
    submittedUserName.value = form.firstName;
    currentStep.value = 4; // Mark step 3 as complete by advancing to step 4

    submitted.value = true;

    // Hide success message after 5 seconds
    setTimeout(() => {
      submitted.value = false;
    }, 5000);
  } catch (err: any) {
    error.value = true;

    // Handle specific error types
    if (err.statusCode === 409 && err.statusMessage === 'DUPLICATE_EMAIL') {
      errorType.value = 'duplicate_email';
      errorMessage.value =
        err.data?.message ||
        'Great news! We already have your information and will be in touch soon.';
    } else if (
      err.statusCode === 500 &&
      err.statusMessage === 'DATABASE_ERROR'
    ) {
      errorType.value = 'database_error';
      errorMessage.value =
        err.data?.message ||
        'We encountered a technical issue processing your request.';
    } else {
      errorType.value = 'general_error';
      errorMessage.value =
        'There was an error submitting your request. Please try calling us for immediate assistance.';
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>
