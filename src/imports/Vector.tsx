import svgPaths from "./svg-afozofwi9h";

export default function Vector() {
  return (
    <div className="relative size-full" data-name="Vector">
      <div className="absolute inset-[0_-1.56%_-3.17%_-1.56%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 264 260">
          <g filter="url(#filter0_d_61_332)" id="Vector">
            <path d={svgPaths.p3b873680} fill="var(--fill-0, white)" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="260" id="filter0_d_61_332" width="264" x="6.37647e-08" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_61_332" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_61_332" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}