import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute(
  '/_protected/_layout/checkout/_layout_checkout/suggestions/'
)({
  component: () => {
    return <SuggestionsPage />;
  },
});
const SuggestionsPage = () => {
  return <div></div>;
};
