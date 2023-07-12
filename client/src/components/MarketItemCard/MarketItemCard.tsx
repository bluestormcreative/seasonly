import { IconButton, ImageListItem, ImageListItemBar } from "@mui/material";
import { ShoppingBasket } from "@mui/icons-material";
import { MarketItemModel } from "@/models/marketItem";
import styles from "./MarketItemCard.module.css";

type MarketItemCardProps = {
  item: MarketItemModel;
};

const MarketItemCard = ({ item }: MarketItemCardProps) => {
  const imgUrl = `/${item.name}.jpg`;

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
      <ImageListItemBar
        title={item.displayName}
        actionIcon={
          <IconButton
            aria-label={`Save ${item.displayName} to a shopping list`}
          >
            <ShoppingBasket className={styles.basket_icon} />
          </IconButton>
        }
      />
    </ImageListItem>
  );
};

export { MarketItemCard };
