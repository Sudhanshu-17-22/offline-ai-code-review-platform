'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { z } from 'zod';
import { FormInput } from '@/components/ui/form.input';
import { Button } from '@/components/ui/accessible.button';
import { useToast } from '@/hooks/use.toast';
import { Code2 } from 'lucide-react';

const CreateReviewSchema = z.object({
  code: z
    .string()
    .min(1, 'Source code is required')
    .max(100000, 'Source code must not exceed 100,000 characters'),
  language: z
    .string()
    .min(1, 'Programming language is required'),
  fileName: z.string().optional(),
  description: z.string().optional(),
});

type ReviewFormData = z.infer<typeof CreateReviewSchema>;

interface ReviewFormProps {
  onSubmit: (data: ReviewFormData) => Promise<void>;
}

export const ReviewForm = ({ onSubmit }: ReviewFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [codeLength, setCodeLength] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<ReviewFormData>({
    resolver: zodResolver(CreateReviewSchema),
    mode: 'onBlur',
  });

  const toast = useToast();
  const code = watch('code');
  const language = watch('language');

  const onSubmitForm = async (data: ReviewFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      toast.success('Code submitted for review!');
      reset();
      setCodeLength(0);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to submit review'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      <div>
        <label
          htmlFor="language"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Programming Language *
        </label>

        <select
          id="language"
          {...register('language')}
          className="w-full px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          aria-describedby={errors.language ? 'language-error' : undefined}
        >
          <option value="">Select a language...</option>
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="csharp">C#</option>
          <option value="go">Go</option>
          <option value="rust">Rust</option>
        </select>

        {errors.language && (
          <p
            id="language-error"
            className="text-sm text-red-600 dark:text-red-400 mt-1"
            role="alert"
          >
            {errors.language.message}
          </p>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label
            htmlFor="code"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Source Code *
          </label>

          <span className="text-xs text-gray-500 dark:text-gray-400">
            {codeLength} / 100,000 characters
          </span>
        </div>

        <textarea
          id="code"
          {...register('code', {
            onChange: (event) => {
              setCodeLength(event.target.value.length);
            },
          })}
          className={`
            w-full h-96 px-4 py-3 font-mono text-sm border-2 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500
            dark:bg-gray-800 dark:text-white dark:border-gray-600
            ${errors.code ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
            resize-none
          `}
          placeholder="Paste your code here..."
          aria-describedby={errors.code ? 'code-error' : undefined}
        />

        {errors.code && (
          <p
            id="code-error"
            className="text-sm text-red-600 dark:text-red-400 mt-1"
            role="alert"
          >
            {errors.code.message}
          </p>
        )}
      </div>

      <FormInput
        label="File Name (optional)"
        placeholder="index.js"
        {...register('fileName')}
      />

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Description (optional)
        </label>

        <textarea
          id="description"
          {...register('description')}
          className="w-full h-24 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white resize-none"
          placeholder="Add any context about your code..."
        />
      </div>

      <div className="flex gap-4">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSubmitting}
          disabled={!code || !language || isSubmitting}
          icon={<Code2 size={20} />}
          className="flex-1"
        >
          {isSubmitting ? 'Submitting...' : 'Submit for Review'}
        </Button>

        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={() => {
            reset();
            setCodeLength(0);
          }}
        >
          Clear
        </Button>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-200">
        <p className="font-medium mb-1">💡 Pro Tips:</p>

        <ul className="list-disc list-inside space-y-1 opacity-90">
          <li>Your code stays private - never sent to external services</li>
          <li>Include context for better AI review suggestions</li>
          <li>Larger files may take longer to analyze</li>
          <li>Review results include both AI insights and static analysis</li>
        </ul>
      </div>
    </form>
  );
};








