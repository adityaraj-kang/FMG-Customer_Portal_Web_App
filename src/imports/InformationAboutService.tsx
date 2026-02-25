import imgMapMakerDark from "figma:asset/99c9b425f49ab141ae52cffca3b86fd851791335.png";

function Group() {
  return (
    <div className="absolute contents left-[184px] top-[125px]">
      <div className="absolute bg-[#d9d9d9] h-[48px] left-[185px] top-[126px] w-[52px]" />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[normal] left-[195px] not-italic text-[18px] text-black top-[139px]">Call</p>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents left-[126px] top-[125px]">
      <div className="absolute bg-[#d9d9d9] h-[48px] left-[127px] top-[126px] w-[52px]" />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[normal] left-[135px] not-italic text-[18px] text-black top-[139px]">App</p>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-[242px] top-[125px]">
      <div className="absolute bg-[#d9d9d9] h-[48px] left-[243px] top-[126px] w-[52px]" />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[normal] left-[250px] not-italic text-[18px] text-black top-[139px]">Text</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-white border border-black border-solid h-[190px] left-1/2 top-[calc(50%+291px)] w-[315px]">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[normal] left-[9px] not-italic text-[24px] text-black top-[12px]">Service provider</p>
      <Group />
      <Group2 />
      <Group1 />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[9px] not-italic text-[16px] text-black top-[49px] w-[300px] whitespace-pre-wrap">Horem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.</p>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents left-[24px] top-[36px]">
      <div className="absolute bg-[#d9d9d9] h-[48px] left-[24px] top-[36px] w-[52px]" />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[normal] left-[24px] not-italic text-[18px] text-black top-[49px]">Arrow</p>
    </div>
  );
}

export default function InformationAboutService() {
  return (
    <div className="bg-white relative size-full" data-name="Information about service">
      <div className="absolute left-[-251px] size-[852px] top-0" data-name="🌎 Map Maker:  (Dark)">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgMapMakerDark} />
      </div>
      <Frame />
      <Group3 />
    </div>
  );
}