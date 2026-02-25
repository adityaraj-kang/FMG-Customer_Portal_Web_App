import imgMapMakerDark from "figma:asset/99c9b425f49ab141ae52cffca3b86fd851791335.png";

function Frame() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute content-stretch flex flex-col gap-[10px] items-center justify-center left-[calc(50%+0.5px)] p-[10px] top-[calc(50%+0.5px)]">
      <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
      <div className="bg-[#d9d9d9] shrink-0 size-[128px]" />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[18px] text-black">Loading animation</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute bg-white h-[319px] left-0 overflow-clip top-[266px] w-[393px]">
      <Frame />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-[24px] top-[36px]">
      <div className="absolute bg-[#d9d9d9] h-[48px] left-[24px] top-[36px] w-[52px]" />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[normal] left-[24px] not-italic text-[18px] text-black top-[49px]">Arrow</p>
    </div>
  );
}

export default function LoadingScreen() {
  return (
    <div className="bg-white relative size-full" data-name="Loading screen">
      <div className="absolute left-[-251px] size-[852px] top-0" data-name="🌎 Map Maker:  (Dark)">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgMapMakerDark} />
      </div>
      <Frame1 />
      <Group />
    </div>
  );
}