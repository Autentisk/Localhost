import { FunctionComponent } from "react";
import Homepage from "../pages/Homepage";
import SellItem from "../pages/SellItem";
import Transfer from "../pages/Transfer";
import Review from "../pages/Review";
import ReviewItem from "../pages/ReviewItem";
import Burn from "../pages/Burn";
import Verify from "../pages/Verify";

interface RouteDefinition {
  title: string;
  path: string;
  exact: boolean;
  Component: FunctionComponent;
}

const routes: RouteDefinition[] = [
  {
    title: "Homepage",
    path: "/homepage",
    exact: true,
    Component: Homepage,
  },
  {
    title: "Sellitem",
    path: "/sellitem",
    exact: true,
    Component: SellItem,
  },
  {
    title: "Transfer",
    path: "/transfer",
    exact: true,
    Component: Transfer,
  },
  {
    title: "Review",
    path: "/review",
    exact: true,
    Component: Review,
  },
  {
    title: "ReviewItem",
    path: "/review/:itemId",
    exact: true,
    Component: ReviewItem,
  },
  {
    title: "Burn",
    path: "/burn",
    exact: true,
    Component: Burn,
  },
  {
    title: "Verify",
    path: "/verify",
    exact: true,
    Component: Verify,
  },
];

export default routes;
