import {
	BaseBoxShapeUtil,
	Box,
	BoxModel,
	Geometry2d,
	Group2d,
	Rectangle2d,
	SVGContainer,
	SvgExportContext,
	TLDefaultVerticalAlignStyle,
	TLFrameShape as TLBaseFrameShape,
	TLFrameShapeProps as TLBaseFrameShapeProps,
	TLGroupShape,
	TLMeasureTextSpanOpts,
	TLResizeInfo,
	TLShape,
	frameShapeMigrations,
	getDefaultColorTheme,
	lerp,
	resizeBox,
	toDomPrecision,
	useIsDarkMode,
	useValue,
	HTMLContainer,
} from '@tldraw/editor'
import classNames from 'classnames'
import { T } from 'tldraw'

interface CustomFrameShapeProps extends TLBaseFrameShapeProps {
	color: string
}

const customFrameShapeProps = {
	w: T.positiveNumber,
	h: T.positiveNumber,
	name: T.string,
	color: T.literalEnum('white', 'blue', 'yellow', 'red')
}

import { FrameHeading } from './components/FrameHeading'
import { FrameColorPicker } from './components/FrameColorPicker'
import {
	getFrameHeadingOpts,
	getFrameHeadingSide,
	getFrameHeadingSize,
	getFrameHeadingTranslation,
} from './frameHelpers'
import { FRAME_COLOR_TRANSPARENT } from '../util/constants'

function correctSpacesToNbsp(input: string) {
	return input.replace(/\s/g, '\xa0')
}

export function createTextJsxFromSpans(
	spans: { text: string; box: BoxModel }[],
	opts: TLCreateTextJsxFromSpansOpts
) {
	const { padding = 0 } = opts
	if (spans.length === 0) return null

	const bounds = Box.From(spans[0].box)
	for (const { box } of spans) {
		bounds.union(box)
	}

	const offsetX = padding + (opts.offsetX ?? 0)
	const offsetY =
		(opts.offsetY ?? 0) +
		opts.fontSize / 2 +
		(opts.verticalTextAlign === 'start'
			? padding
			: opts.verticalTextAlign === 'end'
				? opts.height - padding - bounds.height
				: (Math.ceil(opts.height) - bounds.height) / 2)

	// Create text span elements for each word
	let currentLineTop = null
	const children = []
	for (const { text, box } of spans) {
		// if we broke a line, add a line break span. This helps tools like
		// figma import our exported svg correctly
		const didBreakLine = currentLineTop !== null && box.y > currentLineTop
		if (didBreakLine) {
			children.push(
				<tspan
					key={children.length}
					alignmentBaseline="mathematical"
					x={offsetX}
					y={box.y + offsetY}
				>
					{'\n'}
				</tspan>
			)
		}

		children.push(
			<tspan
				key={children.length}
				alignmentBaseline="mathematical"
				x={box.x + offsetX}
				y={box.y + offsetY}
				// N.B. This property, while discouraged ("intended for Document Type Definition (DTD) designers")
				// is necessary for ensuring correct mixed RTL/LTR behavior when exporting SVGs.
				unicodeBidi="plaintext"
			>
				{correctSpacesToNbsp(text)}
			</tspan>
		)

		currentLineTop = box.y
	}

	return (
		<text
			fontSize={opts.fontSize}
			fontFamily={opts.fontFamily}
			fontStyle={opts.fontStyle}
			fontWeight={opts.fontWeight}
			dominantBaseline="mathematical"
			alignmentBaseline="mathematical"
			stroke={opts.stroke}
			strokeWidth={opts.strokeWidth}
			fill={opts.fill}
		>
			{children}
		</text>
	)
}


export interface TLCreateTextJsxFromSpansOpts extends TLMeasureTextSpanOpts {
	verticalTextAlign: TLDefaultVerticalAlignStyle
	offsetX: number
	offsetY: number
	stroke?: string
	strokeWidth?: number
	fill?: string
}

export function useDefaultColorTheme() {
	return getDefaultColorTheme({ isDarkMode: useIsDarkMode() })
}


export function defaultEmptyAs(str: string, dflt: string) {
	if (str.match(/^\s*$/)) {
		return dflt
	}
	return str
}

/** @public */
export class FrameShapeUtil extends BaseBoxShapeUtil<TLBaseFrameShape> {
	static override type = 'frame' as const
	static override props = customFrameShapeProps
	static override migrations = frameShapeMigrations

	override canEdit() {
		return true
	}

	override getDefaultProps(): TLBaseFrameShape['props'] {
		return { w: 1000, h: 500, name: '', color: 'white' } as CustomFrameShapeProps;
	}

	override getGeometry(shape: TLBaseFrameShape): Geometry2d {
		const { editor } = this
		const z = editor.getZoomLevel()
		const opts = getFrameHeadingOpts(shape, 'black')
		const box = getFrameHeadingSize(editor, shape, opts)
		const labelSide = getFrameHeadingSide(editor, shape)

		// wow this fucking sucks!!!
		let x: number, y: number, w: number, h: number

		const { w: hw, h: hh } = box
		const scaledW = Math.min(hw, shape.props.w * z)
		const scaledH = Math.min(hh, shape.props.h * z)

		switch (labelSide) {
			case 0: {
				x = -8 / z
				y = (-hh - 4) / z
				w = (scaledW + 16) / z
				h = hh / z
				break
			}
			case 1: {
				x = (-hh - 4) / z
				h = (scaledH + 16) / z
				y = shape.props.h - h + 8 / z
				w = hh / z
				break
			}
			case 2: {
				x = shape.props.w - (scaledW + 8) / z
				y = shape.props.h + 4 / z
				w = (scaledH + 16) / z
				h = hh / z
				break
			}
			case 3: {
				x = shape.props.w + 4 / z
				h = (scaledH + 16) / z
				y = -8 / z
				w = hh / z
				break
			}
		}

		return new Group2d({
			children: [
				new Rectangle2d({
					width: shape.props.w,
					height: shape.props.h,
					isFilled: false,
				}),
				new Rectangle2d({
					x,
					y,
					width: w,
					height: h,
					isFilled: true,
					isLabel: true,
				}),
			],
		})
	}

	override getText(shape: TLBaseFrameShape): string | undefined {
		return shape.props.name
	}

	override component(shape: TLBaseFrameShape) {
		const isSelected = this.editor.getOnlySelectedShapeId() === shape.id

		const isCreating = useValue(
			'is creating this shape',
			() => {
				const resizingState = this.editor.getStateDescendant('select.resizing')
				if (!resizingState) return false
				if (!resizingState.getIsActive()) return false
				const info = (resizingState as typeof resizingState & { info: { isCreating: boolean } })
					?.info
				if (!info) return false
				return info.isCreating && this.editor.getOnlySelectedShapeId() === shape.id
			},
			[shape.id]
		)

		// Type assertion for color prop
		const color = (shape.props as CustomFrameShapeProps).color as keyof typeof FRAME_COLOR_TRANSPARENT || 'blue'

		return (
			<HTMLContainer>
				<SVGContainer>
					<rect
						className={classNames('tl-frame__body', { 'tl-frame__creating': isCreating })}
						width={shape.props.w}
						height={shape.props.h}
						fill={FRAME_COLOR_TRANSPARENT[color]}
						stroke="rgba(0, 0, 0, 0.2)"
						rx={shape.props.w / 100}
						ry={shape.props.h / 100}
					/>
				</SVGContainer>
				<FrameHeading
					id={shape.id}
					name={shape.props.name || 'Frame'}
					width={shape.props.w}
					height={shape.props.h}
				/>
				{isSelected && (
					<FrameColorPicker
						shape={shape as TLBaseFrameShape & { props: { color: string } }}
						editor={this.editor}
						isSelected={isSelected}
					/>
				)}
			</HTMLContainer>
		)
	}

	override toSvg(shape: TLBaseFrameShape, ctx: SvgExportContext) {
		const theme = getDefaultColorTheme({ isDarkMode: ctx.isDarkMode })

		// rotate right 45 deg
		const labelSide = getFrameHeadingSide(this.editor, shape)
		const labelTranslate = getFrameHeadingTranslation(shape, labelSide, true)

		// Truncate with ellipsis
		const opts: TLCreateTextJsxFromSpansOpts = getFrameHeadingOpts(shape, theme.text)

		const frameTitle = defaultEmptyAs(shape.props.name, 'Frame') + String.fromCharCode(8203)
		const labelBounds = getFrameHeadingSize(this.editor, shape, opts)
		const spans = this.editor.textMeasure.measureTextSpans(frameTitle, opts)
		const text = createTextJsxFromSpans(spans, opts)

		return (
			<>
				<rect
					width={shape.props.w}
					height={shape.props.h}
					fill={theme.solid}
					stroke={theme.black.solid}
					strokeWidth={1}
					rx={1}
					ry={1}
				/>
				<g transform={labelTranslate}>
					<rect
						x={labelBounds.x - 8}
						y={labelBounds.y - 4}
						width={labelBounds.width + 20}
						height={labelBounds.height}
						fill={theme.background}
						rx={4}
						ry={4}
					/>
					{text}
				</g>
			</>
		)
	}

	indicator(shape: TLBaseFrameShape) {
		return (
			<rect
				width={toDomPrecision(shape.props.w)}
				height={toDomPrecision(shape.props.h)}
				className={`tl-frame-indicator`}
				rx={10}
				ry={10}
			/>
		)
	}

	override canReceiveNewChildrenOfType(shape: TLShape, _type: TLShape['type']) {
		return !shape.isLocked
	}

	override canDropShapes(shape: TLBaseFrameShape, _shapes: TLShape[]): boolean {
		return !shape.isLocked
	}

	override onDragShapesOver(frame: TLBaseFrameShape, shapes: TLShape[]) {
		if (!shapes.every((child) => child.parentId === frame.id)) {
			this.editor.reparentShapes(shapes, frame.id)
		}
	}

	override onDragShapesOut(_shape: TLBaseFrameShape, shapes: TLShape[]): void {
		const parent = this.editor.getShape(_shape.parentId)
		const isInGroup = parent && this.editor.isShapeOfType<TLGroupShape>(parent, 'group')

		// If frame is in a group, keep the shape
		// moved out in that group

		if (isInGroup) {
			this.editor.reparentShapes(shapes, parent.id)
		} else {
			this.editor.reparentShapes(shapes, this.editor.getCurrentPageId())
		}
	}

	override onResize(shape: any, info: TLResizeInfo<any>) {
		return resizeBox(shape, info)
	}
	override getInterpolatedProps(
		startShape: TLBaseFrameShape,
		endShape: TLBaseFrameShape,
		t: number
	): TLBaseFrameShapeProps {
		return {
			...(t > 0.5 ? endShape.props : startShape.props),
			w: lerp(startShape.props.w, endShape.props.w, t),
			h: lerp(startShape.props.h, endShape.props.h, t),
		}
	}
}
