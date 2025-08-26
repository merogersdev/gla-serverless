import List from "../components/item/list/List";
import Add from "../components/item/add/Add";
import { MiniContainer } from "../components/container/Container";

const items = [
  {
    name: "Sugar",
    id: "sugar",
  },
  {
    name: "Milk",
    id: "milk",
  },
  {
    name: "Eggs",
    id: "eggs",
  },
];

export default function HomePage() {
  return (
    <MiniContainer>
      <Add />
      <List items={items} message="Yay! No more groceries!" />
    </MiniContainer>
  );
}
