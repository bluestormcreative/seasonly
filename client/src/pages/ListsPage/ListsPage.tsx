import { UserModel } from "@models/user";
import { Typography } from "@mui/material";
import { ListsPageLoggedInView } from "./ListsPageLoggedInView";
import { ListsPageLoggedOutView } from "./ListsPageLoggedOutView";

type ListsPageProps = {
  loggedInUser: UserModel | null;
};

const ListsPage = ({ loggedInUser }: ListsPageProps) => {
  return (
    <>
      <Typography
        className="heading welcome"
        variant="h4"
        component="h2"
        mb={3}
      >
        Saved shopping lists
      </Typography>
      {loggedInUser ? <ListsPageLoggedInView /> : <ListsPageLoggedOutView />}
    </>
  );
};

export { ListsPage };
