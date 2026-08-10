export const PROPERTY_PRIMITIVE_TYPES = ['select', 'person', 'multi-person', 'date', 'string'] as const

export type PropertyPrimitiveType = (typeof PROPERTY_PRIMITIVE_TYPES)[number]

export interface PropertyDefinition<TType extends PropertyPrimitiveType = PropertyPrimitiveType> {
  id: string
  label: string
  type: TType
}

export interface PropertyValueChange<TValue> {
  definition: PropertyDefinition
  previousValue: TValue
  value: TValue
}
