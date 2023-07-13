import { useState } from "react";
import {
  IconButton,
  ImageListItem,
  ImageListItemBar,
  Snackbar,
  Alert,
  Button,
} from "@mui/material";
import { ShoppingBasket, HighlightOff, ListAlt } from "@mui/icons-material";
import { useLoggedInUser } from "@/context/userContext";
import { MarketItemModel } from "@/models/marketItem";
import styles from "./MarketItemCard.module.css";

type MarketItemCardProps = {
  item: MarketItemModel;
  onBasketButtonClick: (newItem: MarketItemModel) => void;
  onRemoveButtonClick: (itemToRemove: MarketItemModel) => void;
  onViewListButtonClick: () => void;
  onSnackBarLinkClick: () => void;
};

const MarketItemCard = ({
  item,
  onBasketButtonClick,
  onRemoveButtonClick,
  onViewListButtonClick,
  onSnackBarLinkClick,
}: MarketItemCardProps) => {
  const { loggedInUser } = useLoggedInUser();
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [isInBasket, setIsInBasket] = useState(false);
  const imgUrl = `/${item.name}.jpg`;

  const handleBasketButtonClick = () => {
    if (loggedInUser?.username === "") {
      setSnackBarOpen(true);
    } else {
      setSnackBarOpen(true);
      onBasketButtonClick(item);
      setIsInBasket(true);
    }
  };

  const handleRemoveButtonClick = () => {
    onRemoveButtonClick(item);
    setIsInBasket(false);
  };

  const handleSnackBarClose = () => {
    setSnackBarOpen(false);
  };

  const actionSnackBar = () =>
    loggedInUser?.username !== "" ? (
      <Alert
        onClose={handleSnackBarClose}
        severity="success"
        sx={{ width: "100%" }}
      >
        Item added to shopping list.{" "}
        <Button variant="text" onClick={onSnackBarLinkClick}>
          View list
        </Button>
      </Alert>
    ) : (
      <Alert
        onClose={handleSnackBarClose}
        severity="warning"
        sx={{ width: "100%" }}
      >
        Sign up or log in to save shopping lists.
      </Alert>
    );

  const cardButton = () => {
    const button = isInBasket ? (
      <>
        <IconButton
          aria-label={`View shopping list`}
          onClick={onViewListButtonClick}
        >
          <ListAlt className={styles.button_icon} />
        </IconButton>
        <IconButton
          aria-label={`Remove ${item.displayName} from shopping list`}
          onClick={handleRemoveButtonClick}
        >
          <HighlightOff className={styles.button_icon} />
        </IconButton>
      </>
    ) : (
      <IconButton
        aria-label={`Save ${item.displayName} to new shopping list`}
        onClick={handleBasketButtonClick}
      >
        <ShoppingBasket className={styles.button_icon} />
      </IconButton>
    );
    return button;
  };

  return (
    <ImageListItem key={item.name} className={styles.market_item_card}>
      {imgUrl ? (
        <img
          src={`${imgUrl}?w=248&fit=crop&auto=format`}
          srcSet={`${imgUrl}?w=248&fit=crop&auto=format&dpr=2 2x`}
          alt={item.name}
          loading="lazy"
        />
      ) : null}
      <Snackbar
        open={snackBarOpen}
        autoHideDuration={2000}
        onClose={handleSnackBarClose}
      >
        {actionSnackBar()}
      </Snackbar>
      <ImageListItemBar
        className={styles.fancy_title}
        title={item.displayName}
        actionIcon={cardButton()}
      />
    </ImageListItem>
  );
};

export { MarketItemCard };
