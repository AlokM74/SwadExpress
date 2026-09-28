import { Chip, Stack, Typography } from "@mui/material";



const CATEGORY_COLOR = {
  "Nuts & Seeds": "#f59e0b",
  Protein: "#f87171",
  Bread: "#d4a373",
  Vegetable: "#4ade80",
  Condiment: "#38bdf8",
  Dairy: "#a78bfa",
};

const IngredientGroups = ({ ingredients }) => (
  <Stack spacing={0.9}>
    {ingredients.map((group) => (
      <Stack
        key={group.category}
        direction="row"
        spacing={1}
        alignItems="flex-start"
        flexWrap="wrap"
      >
        <Chip
          label={group.category}
          size="small"
          sx={{
            height: 22,
            fontSize: "10px",
            fontWeight: 700,
            borderRadius: "6px",
            color: CATEGORY_COLOR[group.category] ?? "#ccc",
            backgroundColor: `${CATEGORY_COLOR[group.category] ?? "#888"}1a`,
            mt: 0.2,
          }}
        />

        <Typography
          sx={{
            fontSize: 12,
            color: "#ccc",
            flex: 1,
            minWidth: 120,
            lineHeight: 1.6,
          }}
        >
          {group.items.join(", ")}
        </Typography>
      </Stack>
    ))}
  </Stack>
);
export default IngredientGroups;