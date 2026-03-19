import { requireNativeView } from 'expo';
import * as React from 'react';

import { type ModifierConfig } from '../../types';
import { getTextFromChildren } from '../../utils';
import { createViewModifierEventListener } from '../modifiers/utils';

/**
 * Font weight options for text styling.
 */
export type TextFontWeight =
  | 'normal'
  | 'bold'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900';

/**
 * Font style options for text styling.
 */
export type TextFontStyle = 'normal' | 'italic';

/**
 * Text alignment options.
 */
export type TextAlign = 'left' | 'right' | 'center' | 'justify' | 'start' | 'end';

/**
 * Text decoration options.
 */
export type TextDecoration = 'none' | 'underline' | 'lineThrough';

/**
 * Text overflow behavior options.
 */
export type TextOverflow = 'clip' | 'ellipsis' | 'visible';

/**
 * Font family for text styling.
 * Built-in system families: 'default', 'sansSerif', 'serif', 'monospace', 'cursive'.
 * Custom font families loaded via expo-font can be referenced by name (e.g., 'Inter-Bold').
 */
export type TextFontFamily =
  | 'default'
  | 'sansSerif'
  | 'serif'
  | 'monospace'
  | 'cursive'
  | (string & {});

/**
 * Text shadow configuration.
 * Corresponds to Jetpack Compose's Shadow class.
 */
export type TextShadow = {
  /**
   * The color of the shadow.
   */
  color?: string;
  /**
   * The horizontal offset of the shadow in dp.
   */
  offsetX?: number;
  /**
   * The vertical offset of the shadow in dp.
   */
  offsetY?: number;
  /**
   * The blur radius of the shadow in dp.
   */
  blurRadius?: number;
};

/**
 * Material 3 Typography scale styles.
 * Corresponds to MaterialTheme.typography in Jetpack Compose.
 */
export type TypographyStyle =
  | 'displayLarge'
  | 'displayMedium'
  | 'displaySmall'
  | 'headlineLarge'
  | 'headlineMedium'
  | 'headlineSmall'
  | 'titleLarge'
  | 'titleMedium'
  | 'titleSmall'
  | 'bodyLarge'
  | 'bodyMedium'
  | 'bodySmall'
  | 'labelLarge'
  | 'labelMedium'
  | 'labelSmall';

/**
 * Text style properties that can be applied to text.
 * Corresponds to Jetpack Compose's TextStyle.
 */
export type TextStyle = {
  /**
   * Material 3 Typography style to use as the base style.
   * When specified, applies the predefined Material 3 typography style.
   * Other properties in this style object will override specific values from the typography.
   *
   * @example
   * ```tsx
   * style={{ typography: "bodyLarge" }}
   * style={{ typography: "headlineMedium", fontWeight: "bold" }}
   * ```
   */
  typography?: TypographyStyle;

  /**
   * The font size in sp (scale-independent pixels).
   */
  fontSize?: number;

  /**
   * The font weight of the text.
   */
  fontWeight?: TextFontWeight;

  /**
   * The font style of the text.
   */
  fontStyle?: TextFontStyle;

  /**
   * The text alignment.
   */
  textAlign?: TextAlign;

  /**
   * The text decoration.
   */
  textDecoration?: TextDecoration;

  /**
   * The font family.
   */
  fontFamily?: TextFontFamily;

  /**
   * The letter spacing in sp.
   */
  letterSpacing?: number;

  /**
   * The line height in sp.
   */
  lineHeight?: number;

  /**
   * The background color behind the text.
   */
  background?: string;

  /**
   * The shadow applied to the text.
   */
  shadow?: TextShadow;
};

/**
 * A record representing a styled text span, used for nested Text rendering.
 * Each span carries its own style overrides that merge with the parent's base style.
 */
type TextSpanRecord = {
  text: string;
  color?: string;
  fontSize?: number;
  fontWeight?: TextFontWeight;
  fontStyle?: TextFontStyle;
  fontFamily?: TextFontFamily;
  textDecoration?: TextDecoration;
  letterSpacing?: number;
  background?: string;
  shadow?: TextShadow;
};

export type TextProps = {
  /**
   * The text content to display. Can be a string, number, or nested Text components
   * for inline styled spans.
   *
   * @example
   * ```tsx
   * <Text style={{ fontWeight: "bold" }}>
   *   Hello <Text style={{ fontStyle: "italic" }}>world</Text>
   * </Text>
   * ```
   */
  children?: React.ReactNode;

  /**
   * The color of the text.
   */
  color?: string;

  /**
   * How visual overflow should be handled.
   * - 'clip': Clips the overflowing text to fix its container
   * - 'ellipsis': Uses an ellipsis to indicate that the text has overflowed
   * - 'visible': Renders overflow text outside its container
   */
  overflow?: TextOverflow;

  /**
   * Whether the text should break at soft line breaks.
   * If false, the glyphs in the text will be positioned as if there was unlimited horizontal space.
   */
  softWrap?: boolean;

  /**
   * An optional maximum number of lines for the text to span, wrapping if necessary.
   * If the text exceeds the given number of lines, it will be truncated according to overflow.
   */
  maxLines?: number;

  /**
   * The minimum height in terms of minimum number of visible lines.
   */
  minLines?: number;

  /**
   * Style configuration for the text.
   * Corresponds to Jetpack Compose's TextStyle parameter.
   */
  style?: TextStyle;

  /**
   * Modifiers for the component.
   */
  modifiers?: ModifierConfig[];
};

type NativeTextProps = Omit<TextProps, 'children' | 'style'> & {
  text?: string;
  spans?: TextSpanRecord[];
  typography?: TypographyStyle;
  fontSize?: number;
  fontWeight?: TextFontWeight;
  fontStyle?: TextFontStyle;
  fontFamily?: TextFontFamily;
  textAlign?: TextAlign;
  textDecoration?: TextDecoration;
  letterSpacing?: number;
  lineHeight?: number;
  background?: string;
  shadow?: TextShadow;
};

const TextNativeView: React.ComponentType<NativeTextProps> = requireNativeView(
  'ExpoUI',
  'TextView'
);

/**
 * Extracts style-related fields from TextProps into a partial TextSpanRecord.
 */
function extractSpanStyle(props: TextProps): Omit<TextSpanRecord, 'text'> {
  return {
    color: props.color,
    fontSize: props.style?.fontSize,
    fontWeight: props.style?.fontWeight,
    fontStyle: props.style?.fontStyle,
    fontFamily: props.style?.fontFamily,
    textDecoration: props.style?.textDecoration,
    letterSpacing: props.style?.letterSpacing,
    background: props.style?.background,
    shadow: props.style?.shadow,
  };
}

/**
 * Merges a parent span style with a child span style.
 * Child values take precedence; parent values are used as fallback.
 */
function mergeSpanStyles(
  parent: Omit<TextSpanRecord, 'text'>,
  child: Omit<TextSpanRecord, 'text'>
): Omit<TextSpanRecord, 'text'> {
  return {
    color: child.color ?? parent.color,
    fontSize: child.fontSize ?? parent.fontSize,
    fontWeight: child.fontWeight ?? parent.fontWeight,
    fontStyle: child.fontStyle ?? parent.fontStyle,
    fontFamily: child.fontFamily ?? parent.fontFamily,
    textDecoration: child.textDecoration ?? parent.textDecoration,
    letterSpacing: child.letterSpacing ?? parent.letterSpacing,
    background: child.background ?? parent.background,
    shadow: child.shadow ?? parent.shadow,
  };
}

/**
 * Recursively walks children, flattening nested <Text> elements into a flat
 * spans array. Each span carries fully resolved styles (merged from ancestors).
 * Returns null if there are no nested Text elements (simple text path).
 */
function collectSpans(
  children: React.ReactNode,
  inheritedStyle: Omit<TextSpanRecord, 'text'> = {}
): TextSpanRecord[] | null {
  if (children === undefined || children === null) return null;

  const childArray = React.Children.toArray(children);
  if (childArray.length === 0) return null;

  const hasNestedText = childArray.some(
    (child) => React.isValidElement(child) && child.type === Text
  );

  if (!hasNestedText) return null;

  const spans: TextSpanRecord[] = [];

  for (const child of childArray) {
    if (typeof child === 'string') {
      spans.push({ text: child, ...inheritedStyle });
    } else if (typeof child === 'number') {
      spans.push({ text: String(child), ...inheritedStyle });
    } else if (React.isValidElement(child) && child.type === Text) {
      const childProps = child.props as TextProps;
      const childStyle = mergeSpanStyles(inheritedStyle, extractSpanStyle(childProps));

      // Recurse into this child's children
      const nestedSpans = collectSpans(childProps.children, childStyle);
      if (nestedSpans) {
        spans.push(...nestedSpans);
      } else {
        // Leaf text node — extract plain text
        const text = getTextFromChildren(childProps.children);
        if (text) {
          spans.push({ text, ...childStyle });
        }
      }
    }
  }

  return spans.length > 0 ? spans : null;
}

function transformTextProps(props: TextProps): NativeTextProps {
  const { children, modifiers, style, ...restProps } = props;

  const spans = collectSpans(children);

  return {
    modifiers,
    ...(modifiers ? createViewModifierEventListener(modifiers) : undefined),
    ...restProps,
    // When spans are present, use them instead of flat text
    ...(spans ? { spans } : { text: getTextFromChildren(children) ?? '' }),
    // Extract typography from style (used as base style)
    typography: style?.typography,
    // Flatten other style properties (these override the typography style)
    fontSize: style?.fontSize,
    fontWeight: style?.fontWeight,
    fontStyle: style?.fontStyle,
    fontFamily: style?.fontFamily,
    textAlign: style?.textAlign,
    textDecoration: style?.textDecoration,
    letterSpacing: style?.letterSpacing,
    lineHeight: style?.lineHeight,
    background: style?.background,
    shadow: style?.shadow,
  };
}

/**
 * Renders a Text component using Jetpack Compose.
 *
 * The Text component provides comprehensive text styling capabilities.
 * The API is aligned with Jetpack Compose's Text composable, where:
 * - Top-level props (color, maxLines, etc.) match Compose's Text parameters
 * - `style` object corresponds to TextStyle, including typography, fontSize, fontWeight, textAlign, etc.
 * - `style.typography` applies Material 3 typography styles (like MaterialTheme.typography)
 *
 * @example
 * Basic usage:
 * ```tsx
 * import { Text } from 'expo-ui';
 *
 * <Text>Hello World</Text>
 * ```
 *
 * @example
 * Using Material 3 Typography (matches Jetpack Compose MaterialTheme.typography):
 * ```tsx
 * <Text style={{ typography: "bodyLarge" }}>Body text</Text>
 * <Text style={{ typography: "headlineMedium" }}>Headline</Text>
 * <Text style={{ typography: "titleSmall" }}>Small title</Text>
 * ```
 *
 * @example
 * Typography with style overrides:
 * ```tsx
 * <Text
 *   color="#007AFF"
 *   style={{
 *     typography: "bodyLarge",
 *     fontWeight: "bold"  // Override the typography's font weight
 *   }}
 * >
 *   Custom styled body text
 * </Text>
 * ```
 *
 * @example
 * With custom style object (matches Jetpack Compose TextStyle):
 * ```tsx
 * <Text
 *   color="#007AFF"
 *   style={{
 *     fontSize: 18,
 *     fontWeight: "bold",
 *     textAlign: "center",
 *     letterSpacing: 1.2
 *   }}
 *   modifiers={[ExpoUI.padding(16)]}
 * >
 *   Styled text
 * </Text>
 * ```
 *
 * @example
 * Text truncation with ellipsis:
 * ```tsx
 * <Text
 *   maxLines={2}
 *   overflow="ellipsis"
 * >
 *   This is a very long text that will be truncated after two lines
 *   with an ellipsis at the end to indicate there's more content...
 * </Text>
 * ```
 */
export function Text(props: TextProps) {
  return <TextNativeView {...transformTextProps(props)} />;
}
