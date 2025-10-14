<template>
  <div class="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
    <h2 class="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
      <MailIcon class="h-6 w-6 flex-none" />
      <span class="ml-3">Get Your Free Life Insurance Quote</span>
    </h2>
    <p class="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
      Ready to protect your family's future? Fill out the form below and we'll
      contact you within 24 hours with a personalized life insurance quote.
    </p>

    <form @submit.prevent="handleSubmit" class="mt-6 space-y-6">
      <!-- Personal Information Section -->
      <div class="space-y-4">
        <h3
          class="text-sm font-medium text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-700 pb-2"
        >
          Personal Information
        </h3>

        <!-- First and Last Name -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              for="firstName"
              class="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              First Name *
            </label>
            <input
              id="firstName"
              v-model="form.firstName"
              type="text"
              required
              :class="[
                'mt-1 w-full appearance-none rounded-md bg-white px-3 py-2 shadow-md shadow-zinc-800/5 outline outline-zinc-900/10 placeholder:text-zinc-400 focus:ring-4 focus:ring-blue-500/10 focus:outline-blue-500 sm:text-sm dark:bg-zinc-700/15 dark:text-zinc-200 dark:outline-zinc-700 dark:placeholder:text-zinc-500 dark:focus:ring-blue-400/10 dark:focus:outline-blue-400',
                errors.firstName ? 'outline-red-500 dark:outline-red-400' : '',
              ]"
              placeholder="John"
              @blur="validateField('firstName')"
            />
            <p
              v-if="errors.firstName"
              class="mt-1 text-xs text-red-600 dark:text-red-400"
            >
              {{ errors.firstName }}
            </p>
          </div>
          <div>
            <label
              for="lastName"
              class="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Last Name *
            </label>
            <input
              id="lastName"
              v-model="form.lastName"
              type="text"
              required
              :class="[
                'mt-1 w-full appearance-none rounded-md bg-white px-3 py-2 shadow-md shadow-zinc-800/5 outline outline-zinc-900/10 placeholder:text-zinc-400 focus:ring-4 focus:ring-blue-500/10 focus:outline-blue-500 sm:text-sm dark:bg-zinc-700/15 dark:text-zinc-200 dark:outline-zinc-700 dark:placeholder:text-zinc-500 dark:focus:ring-blue-400/10 dark:focus:outline-blue-400',
                errors.lastName ? 'outline-red-500 dark:outline-red-400' : '',
              ]"
              placeholder="Doe"
              @blur="validateField('lastName')"
            />
            <p
              v-if="errors.lastName"
              class="mt-1 text-xs text-red-600 dark:text-red-400"
            >
              {{ errors.lastName }}
            </p>
          </div>
        </div>

        <!-- Email and Phone -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Email Address *
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              :class="[
                'mt-1 w-full appearance-none rounded-md bg-white px-3 py-2 shadow-md shadow-zinc-800/5 outline outline-zinc-900/10 placeholder:text-zinc-400 focus:ring-4 focus:ring-blue-500/10 focus:outline-blue-500 sm:text-sm dark:bg-zinc-700/15 dark:text-zinc-200 dark:outline-zinc-700 dark:placeholder:text-zinc-500 dark:focus:ring-blue-400/10 dark:focus:outline-blue-400',
                errors.email ? 'outline-red-500 dark:outline-red-400' : '',
              ]"
              placeholder="john@example.com"
              @blur="validateField('email')"
            />
            <p
              v-if="errors.email"
              class="mt-1 text-xs text-red-600 dark:text-red-400"
            >
              {{ errors.email }}
            </p>
          </div>
          <div>
            <label
              for="phone"
              class="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Phone Number *
            </label>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              required
              :class="[
                'mt-1 w-full appearance-none rounded-md bg-white px-3 py-2 shadow-md shadow-zinc-800/5 outline outline-zinc-900/10 placeholder:text-zinc-400 focus:ring-4 focus:ring-blue-500/10 focus:outline-blue-500 sm:text-sm dark:bg-zinc-700/15 dark:text-zinc-200 dark:outline-zinc-700 dark:placeholder:text-zinc-500 dark:focus:ring-blue-400/10 dark:focus:outline-blue-400',
                errors.phone ? 'outline-red-500 dark:outline-red-400' : '',
              ]"
              placeholder="(555) 123-4567"
              @blur="validateField('phone')"
            />
            <p
              v-if="errors.phone"
              class="mt-1 text-xs text-red-600 dark:text-red-400"
            >
              {{ errors.phone }}
            </p>
          </div>
        </div>

        <!-- Date of Birth -->
        <div>
          <label
            for="dateOfBirth"
            class="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Date of Birth *
          </label>
          <input
            id="dateOfBirth"
            v-model="form.dateOfBirth"
            type="date"
            required
            :max="maxDate"
            :class="[
              'mt-1 w-full appearance-none rounded-md bg-white px-3 py-2 shadow-md shadow-zinc-800/5 outline outline-zinc-900/10 placeholder:text-zinc-400 focus:ring-4 focus:ring-blue-500/10 focus:outline-blue-500 sm:text-sm dark:bg-zinc-700/15 dark:text-zinc-200 dark:outline-zinc-700 dark:placeholder:text-zinc-500 dark:focus:ring-blue-400/10 dark:focus:outline-blue-400',
              errors.dateOfBirth ? 'outline-red-500 dark:outline-red-400' : '',
            ]"
            @blur="validateField('dateOfBirth')"
          />
          <p
            v-if="errors.dateOfBirth"
            class="mt-1 text-xs text-red-600 dark:text-red-400"
          >
            {{ errors.dateOfBirth }}
          </p>
          <p v-else class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Required for accurate life insurance quotes
          </p>
        </div>

        <!-- City and State -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <!-- City -->
          <div>
            <label
              for="city"
              class="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              City *
            </label>
            <input
              id="city"
              v-model="form.city"
              type="text"
              required
              :class="[
                'mt-1 w-full appearance-none rounded-md bg-white px-3 py-2 shadow-md shadow-zinc-800/5 outline outline-zinc-900/10 placeholder:text-zinc-400 focus:ring-4 focus:ring-blue-500/10 focus:outline-blue-500 sm:text-sm dark:bg-zinc-700/15 dark:text-zinc-200 dark:outline-zinc-700 dark:placeholder:text-zinc-500 dark:focus:ring-blue-400/10 dark:focus:outline-blue-400',
                errors.city ? 'outline-red-500 dark:outline-red-400' : '',
              ]"
              placeholder="Enter your city"
              @blur="validateField('city')"
            />
            <p
              v-if="errors.city"
              class="mt-1 text-xs text-red-600 dark:text-red-400"
            >
              {{ errors.city }}
            </p>
          </div>

          <!-- State -->
          <div>
            <label
              for="state"
              class="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              State *
            </label>
            <select
              id="state"
              v-model="form.state"
              required
              :class="[
                'mt-1 w-full appearance-none rounded-md bg-white px-3 py-2 shadow-md shadow-zinc-800/5 outline outline-zinc-900/10 placeholder:text-zinc-400 focus:ring-4 focus:ring-blue-500/10 focus:outline-blue-500 sm:text-sm dark:bg-zinc-700/15 dark:text-zinc-200 dark:outline-zinc-700 dark:placeholder:text-zinc-500 dark:focus:ring-blue-400/10 dark:focus:outline-blue-400',
                errors.state ? 'outline-red-500 dark:outline-red-400' : '',
              ]"
              @blur="validateField('state')"
            >
              <option value="">Select your state</option>
              <option value="AL">Alabama</option>
              <option value="AR">Arkansas</option>
              <option value="AZ">Arizona</option>
              <option value="CA">California</option>
              <option value="CO">Colorado</option>
              <option value="CT">Connecticut</option>
              <option value="FL">Florida</option>
              <option value="GA">Georgia</option>
              <option value="IA">Iowa</option>
              <option value="ID">Idaho</option>
              <option value="IL">Illinois</option>
              <option value="IN">Indiana</option>
              <option value="MA">Massachusetts</option>
              <option value="MD">Maryland</option>
              <option value="MI">Michigan</option>
              <option value="MN">Minnesota</option>
              <option value="MO">Missouri</option>
              <option value="MT">Montana</option>
              <option value="NC">North Carolina</option>
              <option value="NE">Nebraska</option>
              <option value="NJ">New Jersey</option>
              <option value="NM">New Mexico</option>
              <option value="NV">Nevada</option>
              <option value="OH">Ohio</option>
              <option value="PA">Pennsylvania</option>
              <option value="SC">South Carolina</option>
              <option value="SD">South Dakota</option>
              <option value="TN">Tennessee</option>
              <option value="TX">Texas</option>
              <option value="UT">Utah</option>
              <option value="VA">Virginia</option>
              <option value="WA">Washington</option>
              <option value="WI">Wisconsin</option>
              <option value="WY">Wyoming</option>
            </select>
            <p
              v-if="errors.state"
              class="mt-1 text-xs text-red-600 dark:text-red-400"
            >
              {{ errors.state }}
            </p>
            <p v-else class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              We can only provide quotes in states where we're licensed
            </p>
          </div>
        </div>
      </div>

      <!-- Health Information Section -->
      <div class="space-y-4">
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
            <strong>Health Information Privacy:</strong> Medical information you
            provide is securely encrypted and used only for insurance
            underwriting purposes. This information helps us find the most
            accurate rates for your situation and is protected under strict
            privacy guidelines.
          </p>
        </div>

        <!-- Health Conditions -->
        <div>
          <label
            for="healthConditions"
            class="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Current Health Conditions
          </label>
          <textarea
            id="healthConditions"
            v-model="form.healthConditions"
            rows="3"
            :class="[
              'mt-1 w-full appearance-none rounded-md bg-white px-3 py-2 shadow-md shadow-zinc-800/5 outline outline-zinc-900/10 placeholder:text-zinc-400 focus:ring-4 focus:ring-blue-500/10 focus:outline-blue-500 sm:text-sm dark:bg-zinc-700/15 dark:text-zinc-200 dark:outline-zinc-700 dark:placeholder:text-zinc-500 dark:focus:ring-blue-400/10 dark:focus:outline-blue-400',
              errors.healthConditions
                ? 'outline-red-500 dark:outline-red-400'
                : '',
            ]"
            placeholder="Please list any current health conditions, diagnosed illnesses, or ongoing medical concerns. If none, please write 'None'."
            @blur="validateField('healthConditions')"
          />
          <p
            v-if="errors.healthConditions"
            class="mt-1 text-xs text-red-600 dark:text-red-400"
          >
            {{ errors.healthConditions }}
          </p>
          <p v-else class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            This information helps us find the best rates and is kept strictly
            confidential
          </p>
        </div>

        <!-- Medications -->
        <div>
          <label
            for="medications"
            class="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Current Medications
          </label>
          <textarea
            id="medications"
            v-model="form.medications"
            rows="3"
            :class="[
              'mt-1 w-full appearance-none rounded-md bg-white px-3 py-2 shadow-md shadow-zinc-800/5 outline outline-zinc-900/10 placeholder:text-zinc-400 focus:ring-4 focus:ring-blue-500/10 focus:outline-blue-500 sm:text-sm dark:bg-zinc-700/15 dark:text-zinc-200 dark:outline-zinc-700 dark:placeholder:text-zinc-500 dark:focus:ring-blue-400/10 dark:focus:outline-blue-400',
              errors.medications ? 'outline-red-500 dark:outline-red-400' : '',
            ]"
            placeholder="Please list all current medications including dosages if known. If none, please write 'None'."
            @blur="validateField('medications')"
          />
          <p
            v-if="errors.medications"
            class="mt-1 text-xs text-red-600 dark:text-red-400"
          >
            {{ errors.medications }}
          </p>
          <p v-else class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Include prescription medications, over-the-counter drugs, and
            supplements
          </p>
        </div>
      </div>

      <!-- Coverage Information Section -->
      <div class="space-y-4">
        <h3
          class="text-sm font-medium text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-700 pb-2"
        >
          Coverage Information
        </h3>

        <!-- Coverage Type -->
        <div>
          <label
            for="coverageType"
            class="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Type of Coverage Interested In *
          </label>
          <select
            id="coverageType"
            v-model="form.coverageType"
            required
            :class="[
              'mt-1 w-full appearance-none rounded-md bg-white px-3 py-2 shadow-md shadow-zinc-800/5 outline outline-zinc-900/10 placeholder:text-zinc-400 focus:ring-4 focus:ring-blue-500/10 focus:outline-blue-500 sm:text-sm dark:bg-zinc-700/15 dark:text-zinc-200 dark:outline-zinc-700 dark:placeholder:text-zinc-500 dark:focus:ring-blue-400/10 dark:focus:outline-blue-400',
              errors.coverageType ? 'outline-red-500 dark:outline-red-400' : '',
            ]"
            @blur="validateField('coverageType')"
          >
            <option value="">Select coverage type...</option>
            <option value="term-life">Term Life Insurance</option>
            <option value="whole-life">Whole Life Insurance</option>
            <option value="iul">Indexed Universal Life (IUL)</option>
            <option value="mortgage-protection">Mortgage Protection</option>
            <option value="final-expense">Final Expense Insurance</option>
            <option value="annuities">Annuities</option>
            <option value="not-sure">Not Sure - Need Guidance</option>
          </select>
          <p
            v-if="errors.coverageType"
            class="mt-1 text-xs text-red-600 dark:text-red-400"
          >
            {{ errors.coverageType }}
          </p>
          <p v-else class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            We'll help you find the best coverage type for your needs
          </p>
        </div>

        <!-- Message -->
        <div>
          <label
            for="message"
            class="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Additional Information or Questions
          </label>
          <textarea
            id="message"
            v-model="form.message"
            rows="4"
            class="mt-1 w-full appearance-none rounded-md bg-white px-3 py-2 shadow-md shadow-zinc-800/5 outline outline-zinc-900/10 placeholder:text-zinc-400 focus:ring-4 focus:ring-blue-500/10 focus:outline-blue-500 sm:text-sm dark:bg-zinc-700/15 dark:text-zinc-200 dark:outline-zinc-700 dark:placeholder:text-zinc-500 dark:focus:ring-blue-400/10 dark:focus:outline-blue-400"
            placeholder="Tell us about your family's protection needs, coverage amount you're considering, your goals, timeline, or any questions about life insurance..."
          />
          <p class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Optional - Any additional details that might help us serve you
            better
          </p>
        </div>
      </div>

      <!-- TCPA Consent Checkbox -->
      <div class="mt-6">
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
              <span class="text-red-500">*</span> By submitting this form, I
              agree to be contacted by Mowry Agency or its licensed
              representatives at the phone number and email I provided. This may
              include calls, texts, or emails about life insurance and related
              products, even if my number is on a Do Not Call list. I understand
              that my consent is not a condition of purchase and that I can opt
              out at any time.
            </label>
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
            <p class="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
              Your information is secure and used solely for generating your
              personalized life insurance quote. Health information,
              medications, and personal details are encrypted and protected. We
              do not share or sell your information to third parties.
            </p>
          </div>
        </div>
      </div>

      <!-- Submit Section -->
      <div
        class="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-700"
      >
        <Button
          type="submit"
          :disabled="isSubmitting || !isFormValid"
          class="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isSubmitting ? 'Sending...' : 'Get My Quote' }}
        </Button>

        <div class="text-right">
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
      class="mt-4 p-4 rounded-md bg-green-50 dark:bg-green-900/20"
    >
      <p class="text-sm text-green-700 dark:text-green-400">
        ✓ Thank you! We'll contact you within 24 hours with your personalized
        quote.
      </p>
    </div>

    <div
      v-if="error"
      class="mt-4 p-4 rounded-md"
      :class="{
        'bg-green-50 dark:bg-green-900/20': errorType === 'duplicate_email',
        'bg-red-50 dark:bg-red-900/20': errorType !== 'duplicate_email',
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
              'text-red-800 dark:text-red-200': errorType !== 'duplicate_email',
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
              'text-red-700 dark:text-red-300': errorType !== 'duplicate_email',
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
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import MailIcon from './icons/MailIcon.vue';
import Button from './Button.vue';

// Get runtime config for agency contact info
const config = useRuntimeConfig();
const agencyPhone = config.public.agencyPhone as string;
const agencyEmail = config.public.agencyEmail as string;

// Form data structure
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  city: '',
  state: '',
  healthConditions: '',
  medications: '',
  coverageType: '',
  message: '',
  tcpaConsent: false,
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
  const today = new Date();
  return today.toISOString().split('T')[0];
});

const isFormValid = computed(() => {
  const requiredFields = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'dateOfBirth',
    'coverageType',
  ];
  const hasRequiredFields = requiredFields.every(
    (field) => (form[field as keyof typeof form] as string).trim() !== ''
  );
  const hasNoErrors = Object.values(errors).every((error) => error === '');
  const hasConsent = form.tcpaConsent === true;
  return hasRequiredFields && hasNoErrors && hasConsent;
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

  const birthDate = new Date(dateOfBirth);
  const today = new Date();

  // Check for future dates first
  if (birthDate > today) return 'Date of birth cannot be in the future';

  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    const adjustedAge = age - 1;
    if (adjustedAge < 18) return 'You must be at least 18 years old';
    if (adjustedAge > 100) return 'Please enter a valid date of birth';
  } else {
    if (age < 18) return 'You must be at least 18 years old';
    if (age > 100) return 'Please enter a valid date of birth';
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
    'city',
    'state',
    'healthConditions',
    'medications',
    'coverageType',
  ];

  fieldsToValidate.forEach((field) => validateField(field));

  return Object.values(errors).every((error) => error === '');
};

// Form submission
const handleSubmit = async () => {
  if (!validateAllFields()) {
    return;
  }

  isSubmitting.value = true;
  error.value = false;

  try {
    // Send form data to our Nuxt API
    const response = await $fetch('/api/quote', {
      method: 'POST',
      body: {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        dateOfBirth: form.dateOfBirth,
        city: form.city,
        state: form.state,
        healthConditions: form.healthConditions,
        medications: form.medications,
        coverageType: form.coverageType,
        message: form.message,
        tcpaConsent: form.tcpaConsent,
      },
    });

    // Reset form and show success
    Object.keys(form).forEach((key) => {
      if (key === 'tcpaConsent') {
        (form as any)[key] = false;
      } else {
        (form as any)[key] = '';
      }
    });

    // Clear errors
    Object.keys(errors).forEach((key) => {
      errors[key as keyof typeof errors] = '';
    });

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
