import { AuthSignUpRequest } from "@/api/auth-sign-up";

export type SignUpFormProps = {
  formData: AuthSignUpRequest;
  setFormData: React.Dispatch<React.SetStateAction<AuthSignUpRequest>>;
  inputClassNames: {
    input: string;
    inputWrapper: string;
  };
};