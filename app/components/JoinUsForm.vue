<template>
  <form @submit.prevent="submitApplication" class="space-y-6">
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <label
          for="firstName"
          class="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          First Name *
        </label>
        <input
          v-model="form.firstName"
          type="text"
          id="firstName"
          required
          class="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 sm:text-sm"
        />
      </div>

      <div>
        <label
          for="lastName"
          class="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Last Name *
        </label>
        <input
          v-model="form.lastName"
          type="text"
          id="lastName"
          required
          class="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 sm:text-sm"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <label
          for="email"
          class="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Email Address *
        </label>
        <input
          v-model="form.email"
          type="email"
          id="email"
          required
          class="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 sm:text-sm"
        />
      </div>

      <div>
        <label
          for="phone"
          class="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Phone Number *
        </label>
        <input
          v-model="form.phone"
          type="tel"
          id="phone"
          required
          class="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 sm:text-sm"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <label
          for="position"
          class="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Position of Interest *
        </label>
        <select
          v-model="form.position"
          id="position"
          required
          class="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 sm:text-sm"
        >
          <option value="">Select a position</option>
          <option value="insurance-agent">Insurance Agent</option>
          <option value="sales-manager">Sales Manager</option>
          <option value="customer-support">Customer Support</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label
          for="experience"
          class="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Years of Experience
        </label>
        <select
          v-model="form.experience"
          id="experience"
          class="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 sm:text-sm"
        >
          <option value="">Select experience level</option>
          <option value="0">No experience</option>
          <option value="1-2">1-2 years</option>
          <option value="3-5">3-5 years</option>
          <option value="5+">5+ years</option>
        </select>
      </div>
    </div>

    <div>
      <label
        for="state"
        class="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        State/Location *
      </label>
      <input
        v-model="form.state"
        type="text"
        id="state"
        required
        placeholder="e.g., California, TX, Florida"
        class="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 sm:text-sm"
      />
    </div>

    <div>
      <label
        for="resume"
        class="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        Resume/CV
      </label>
      <input
        @change="handleFileUpload"
        type="file"
        id="resume"
        accept=".pdf,.doc,.docx"
        class="mt-1 block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 dark:text-zinc-400 dark:file:bg-teal-900 dark:file:text-teal-300"
      />
      <p class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        PDF, DOC, or DOCX files only. Max size: 5MB
      </p>
    </div>

    <div>
      <label
        for="message"
        class="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        Tell us about yourself and why you're interested in joining our team
      </label>
      <textarea
        v-model="form.message"
        id="message"
        rows="4"
        class="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 sm:text-sm"
        placeholder="Share your background, career goals, and what interests you about the insurance industry..."
      ></textarea>
    </div>

    <div class="flex items-center">
      <input
        v-model="form.agreeToTerms"
        id="agreeToTerms"
        type="checkbox"
        required
        class="h-4 w-4 rounded border-zinc-300 text-teal-600 focus:ring-teal-500 dark:border-zinc-600 dark:bg-zinc-700"
      />
      <label
        for="agreeToTerms"
        class="ml-2 block text-sm text-zinc-700 dark:text-zinc-300"
      >
        I agree to be contacted by Mowry Agency regarding career opportunities *
      </label>
    </div>

    <div>
      <Button
        type="submit"
        :disabled="isSubmitting"
        class="w-full justify-center"
      >
        <span v-if="isSubmitting">Submitting Application...</span>
        <span v-else>Submit Application</span>
      </Button>
    </div>

    <!-- Success/Error Messages -->
    <div
      v-if="submitMessage"
      class="rounded-md p-4"
      :class="
        submitStatus === 'success'
          ? 'bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-200'
          : 'bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-200'
      "
    >
      <p class="text-sm">{{ submitMessage }}</p>
    </div>
  </form>
</template>

<script setup lang="ts">
import Button from '~/components/Button.vue';

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  position: '',
  experience: '',
  state: '',
  resume: null as File | null,
  message: '',
  agreeToTerms: false,
});

const isSubmitting = ref(false);
const submitMessage = ref('');
const submitStatus = ref<'success' | 'error'>('success');

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      target.value = '';
      return;
    }

    // Check file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF, DOC, or DOCX file');
      target.value = '';
      return;
    }

    form.value.resume = file;
  }
};

const submitApplication = async () => {
  isSubmitting.value = true;
  submitMessage.value = '';

  try {
    // Create FormData for file upload
    const formData = new FormData();

    // Add form fields
    Object.keys(form.value).forEach((key) => {
      if (
        key !== 'resume' &&
        form.value[key as keyof typeof form.value] !== null
      ) {
        formData.append(
          key,
          String(form.value[key as keyof typeof form.value])
        );
      }
    });

    // Add file if present
    if (form.value.resume) {
      formData.append('resume', form.value.resume);
    }

    const response = await $fetch('/api/join-us', {
      method: 'POST',
      body: formData,
    });

    submitStatus.value = 'success';
    submitMessage.value =
      "Thank you for your application! We'll review your information and get back to you within 24 hours.";

    // Reset form
    form.value = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: '',
      experience: '',
      state: '',
      resume: null,
      message: '',
      agreeToTerms: false,
    };

    // Reset file input
    const fileInput = document.getElementById('resume') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  } catch (error) {
    console.error('Application submission error:', error);
    submitStatus.value = 'error';
    submitMessage.value =
      'There was an error submitting your application. Please try again or contact us directly.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>
