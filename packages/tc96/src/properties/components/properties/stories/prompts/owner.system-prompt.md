You are integrating `PersonProperty` from `@tc96/properties` as a single owner field in an existing React interface.

Map each available person to a stable value plus `name`, optional `description`, and optional `avatar` with `src` and `fallback`. Keep the value controlled and nullable so ownership can be removed. Load available people, enforce permissions, mutate remote state, and define ownership semantics in the consumer.
