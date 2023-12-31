import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Button,
  IconButton,
  Alert,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { UserModel } from "@models/user";
import { LoginCredentials } from "@api/user.api";
import * as UserApi from "@api/user.api";
import { TextInputField } from "../../formFields/TextInputField";
import { UnauthorizedError } from "@/components/errors/httpErrors";

type LoginDialogProps = {
  onDismiss: () => void;
  onLoginSuccess: (user: UserModel) => void;
};

const LoginDialog = ({ onDismiss, onLoginSuccess }: LoginDialogProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>();
  const [errorText, setErrorText] = useState<string | null>(null);

  async function onLoginSubmit(credentials: LoginCredentials) {
    try {
      const user = await UserApi.login(credentials);
      onLoginSuccess(user);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        setErrorText(error.message);
      }
      console.log(error);
    }
  }

  const handleClose = () => {
    onDismiss();
  };

  return (
    <Dialog open fullWidth maxWidth="sm">
      <DialogTitle>Log in to Seasonly</DialogTitle>
      <DialogContent>
        {errorText ? (
          <Alert severity="error" sx={{ mt: 1 }}>
            {errorText}
          </Alert>
        ) : null}
        <form id="loginForm" onSubmit={handleSubmit(onLoginSubmit)}>
          <Stack my={2}>
            <TextInputField
              name="username"
              label="Username"
              register={register}
              registerOptions={{ required: "Please enter your username" }}
              error={errors.username}
            />
          </Stack>
          <Stack my={2}>
            <TextInputField
              name="password"
              label="Password"
              type="password"
              register={register}
              registerOptions={{ required: "Please enter your password" }}
              error={errors.password}
            />
          </Stack>
        </form>
      </DialogContent>
      <DialogActions>
        <IconButton onClick={handleClose} title="Cancel signup">
          <Close />
        </IconButton>
        <Button
          form="loginForm"
          type="submit"
          disabled={isSubmitting}
          variant="contained"
        >
          Log in
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export { LoginDialog };
