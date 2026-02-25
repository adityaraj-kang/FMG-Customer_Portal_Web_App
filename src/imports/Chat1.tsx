import imgMapMakerDark from "figma:asset/99c9b425f49ab141ae52cffca3b86fd851791335.png";

function Frame() {
  return (
    <div className="absolute border border-black border-solid h-[49px] left-[45px] top-[634px] w-[315px]">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[normal] left-[9px] not-italic text-[24px] text-black top-[9px]">Find me road side...</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute content-stretch flex h-[124px] items-center justify-center left-[106px] py-[10px] top-[132px] w-[254px]">
      <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
      <div className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[normal] min-h-px min-w-px not-italic relative text-[24px] text-black text-right whitespace-pre-wrap">
        <p className="mb-0">Find me a tow service..................</p>
        <p>detailed prompt</p>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute content-stretch flex h-[124px] items-center justify-center left-[39px] py-[10px] top-[286px] w-[254px]">
      <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
      <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[normal] min-h-px min-w-px not-italic relative text-[24px] text-black whitespace-pre-wrap">Follow up question from agent</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute content-stretch flex h-[124px] items-center justify-center left-[106px] py-[10px] top-[440px] w-[254px]">
      <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
      <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[normal] min-h-px min-w-px not-italic relative text-[24px] text-black text-right whitespace-pre-wrap">Confirmation by user</p>
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

function Frame4() {
  return (
    <div className="absolute bg-white h-[762px] left-0 overflow-clip top-[90px] w-[393px]">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[normal] left-[calc(50%+0.5px)] not-italic text-[32px] text-black text-center top-[40px]">Tow service</p>
      <Frame />
      <Frame1 />
      <Frame2 />
      <Frame3 />
      <Group />
    </div>
  );
}

export default function Chat() {
  return (
    <div className="bg-white relative size-full" data-name="Chat-1">
      <div className="absolute left-[-251px] size-[852px] top-0" data-name="🌎 Map Maker:  (Dark)">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgMapMakerDark} />
      </div>
      <Frame4 />
    </div>
  );
}