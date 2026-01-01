import React, { forwardRef, useId, useMemo, useState } from "react";
import clsx from "clsx";
import { Eye, EyeOff, X } from "lucide-react";

/**
 * Premium Input (Skillwave)
 *
 * Props:
 * - label: string
 * - value, onChange
 * - type: text | email | password | ...
 * - leftIcon: ReactNode (shown inside input)
 * - rightIcon: ReactNode (optional)
 * - hint: string (helper text)
 * - error: string (error text)
 * - required: boolean
 * - disabled: boolean
 * - clearable: boolean (shows clear button if value)
 * - containerClassName, inputClassName
 *
 * Works great with Tailwind + DaisyUI themes.
 */
const Input = forwardRef(function Input(
  {
    label,
    value,
    onChange,
    type = "text",
    leftIcon,
    rightIcon,
    hint,
    error,
    required,
    disabled,
    clearable = false,
    containerClassName,
    inputClassName,
    name,
    autoComplete,
    placeholder, // optional; label is the main UX
    onBlur,
    onFocus,
    ...props
  },
  ref
) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const isPassword = type === "password";
  const actualType = isPassword ? (showPw ? "text" : "password") : type;

  const hasValue = useMemo(() => {
    if (value === 0) return true;
    return value !== undefined && value !== null && String(value).length > 0;
  }, [value]);

  const ring = error
    ? "ring-2 ring-error/30 border-error/60 focus-within:ring-error/40"
    : focused
    ? "ring-2 ring-primary/25 border-primary/60"
    : "ring-1 ring-base-300/70 border-base-300";

  return (
    <div className={clsx("w-full", containerClassName)}>
      <div
        className={clsx(
          "relative rounded-2xl bg-base-100 transition-shadow",
          "shadow-[0_14px_45px_-40px_rgba(0,0,0,0.65)]",
          disabled && "opacity-70",
          ring
        )}
      >
        {/* subtle gradient glow */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-70">
          <div className="h-full w-full rounded-2xl bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        </div>

        {/* left icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60">
            {leftIcon}
          </div>
        )}

        {/* input */}
        <input
          id={id}
          ref={ref}
          name={name}
          autoComplete={autoComplete}
          disabled={disabled}
          required={required}
          type={actualType}
          value={value}
          placeholder={placeholder || " "}
          onChange={onChange}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          className={clsx(
            "peer w-full rounded-2xl bg-transparent",
            "px-4 py-4 text-sm outline-none",
            leftIcon ? "pl-11" : "pl-4",
            "pr-16",
            "placeholder:text-transparent",
            "text-base-content",
            inputClassName
          )}
          {...props}
        />

        {/* floating label */}
        {label && (
          <label
            htmlFor={id}
            className={clsx(
              "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2",
              "text-sm text-base-content/55 transition-all duration-200",
              leftIcon && "left-11",
              (focused || hasValue) &&
                "top-3 translate-y-0 text-[11px] text-base-content/65"
            )}
          >
            {label} {required ? <span className="text-error">*</span> : null}
          </label>
        )}

        {/* right cluster */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {/* custom right icon */}
          {rightIcon && (
            <div className="text-base-content/60">{rightIcon}</div>
          )}

          {/* clear */}
          {clearable && !disabled && hasValue && (
            <button
              type="button"
              className={clsx(
                "btn btn-ghost btn-sm rounded-xl",
                "h-9 min-h-0 px-2"
              )}
              aria-label="Clear"
              onClick={() => onChange?.({ target: { value: "" } })}
            >
              <X size={16} />
            </button>
          )}

          {/* password toggle */}
          {isPassword && !disabled && (
            <button
              type="button"
              className={clsx(
                "btn btn-ghost btn-sm rounded-xl",
                "h-9 min-h-0 px-2"
              )}
              aria-label={showPw ? "Hide password" : "Show password"}
              onClick={() => setShowPw((s) => !s)}
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>
      </div>

      {/* helper / error text */}
      <div className="mt-2 min-h-[18px] px-1">
        {error ? (
          <div className="text-xs font-medium text-error">{error}</div>
        ) : hint ? (
          <div className="text-xs text-base-content/60">{hint}</div>
        ) : null}
      </div>
    </div>
  );
});

export default Input;