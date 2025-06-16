
import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CustomFormFieldProps extends HTMLAttributes<HTMLDivElement> {
  error?: string;
}

const CustomFormField = forwardRef<HTMLDivElement, CustomFormFieldProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('space-y-2', className)} {...props}>
        {children}
        {error && (
          <p className="text-sm font-medium text-destructive">{error}</p>
        )}
      </div>
    );
  }
);
CustomFormField.displayName = 'CustomFormField';

interface CustomFormLabelProps extends HTMLAttributes<HTMLLabelElement> {
  htmlFor?: string;
}

const CustomFormLabel = forwardRef<HTMLLabelElement, CustomFormLabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          className
        )}
        {...props}
      />
    );
  }
);
CustomFormLabel.displayName = 'CustomFormLabel';

interface CustomFormControlProps extends HTMLAttributes<HTMLDivElement> {}

const CustomFormControl = forwardRef<HTMLDivElement, CustomFormControlProps>(
  ({ ...props }, ref) => {
    return <div ref={ref} {...props} />;
  }
);
CustomFormControl.displayName = 'CustomFormControl';

interface CustomFormDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

const CustomFormDescription = forwardRef<HTMLParagraphElement, CustomFormDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-sm text-muted-foreground', className)}
        {...props}
      />
    );
  }
);
CustomFormDescription.displayName = 'CustomFormDescription';

interface CustomFormMessageProps extends HTMLAttributes<HTMLParagraphElement> {}

const CustomFormMessage = forwardRef<HTMLParagraphElement, CustomFormMessageProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-sm font-medium text-destructive', className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);
CustomFormMessage.displayName = 'CustomFormMessage';

interface CustomFormSubmitProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CustomFormSubmit = forwardRef<HTMLDivElement, CustomFormSubmitProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('flex justify-end', className)} {...props}>
        {children}
      </div>
    );
  }
);
CustomFormSubmit.displayName = 'CustomFormSubmit';

export {
  CustomFormField,
  CustomFormLabel,
  CustomFormControl,
  CustomFormDescription,
  CustomFormMessage,
  CustomFormSubmit,
};
