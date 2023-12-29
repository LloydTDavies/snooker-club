import "./Player.css";

type PlayerProps = {
  score: number;
  name: string;
  active: boolean;
};

export default function Player({ score, name, active }: PlayerProps) {
  const classes = ["player", active ? "active" : ""].join(" ");
  return (
    <div className={classes}>
      {name}: {score}{" "}
    </div>
  );
}
