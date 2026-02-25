import imgMapMakerDark from "figma:asset/99c9b425f49ab141ae52cffca3b86fd851791335.png";

function Frame() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-white content-stretch flex flex-col gap-[10px] items-center justify-center left-[calc(50%-92.5px)] p-[10px] top-[calc(50%+260px)] w-[128px]">
      <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[18px] text-black">Best</p>
      <div className="bg-[#d9d9d9] shrink-0 size-[64px]" />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[18px] text-black">Price</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-[rgba(255,255,255,0.5)] content-stretch flex flex-col gap-[10px] items-center justify-center left-[calc(50%+93.5px)] p-[10px] top-[calc(50%+260px)] w-[128px]">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.5)] border-solid inset-0 pointer-events-none" />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[18px] text-[rgba(0,0,0,0.5)]">Cheapest</p>
      <div className="bg-[rgba(217,217,217,0.5)] shrink-0 size-[64px]" />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[18px] text-[rgba(0,0,0,0.5)]">Price</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="-translate-x-1/2 absolute bg-white content-stretch flex items-center left-1/2 p-[10px] top-[779px] w-[315px]">
      <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[24px] text-black">Next</p>
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

export default function ChooseService() {
  return (
    <div className="bg-white relative size-full" data-name="Choose service">
      <div className="absolute left-[-251px] size-[852px] top-0" data-name="🌎 Map Maker:  (Dark)">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgMapMakerDark} />
      </div>
      <Frame />
      <Frame1 />
      <Frame2 />
      <Group />
    </div>
  );
}