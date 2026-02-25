import imgMapMakerDark from "figma:asset/99c9b425f49ab141ae52cffca3b86fd851791335.png";

function Group() {
  return (
    <div className="absolute contents left-[24px] top-[36px]">
      <div className="absolute bg-[#d9d9d9] h-[48px] left-[24px] top-[36px] w-[52px]" />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[normal] left-[24px] not-italic text-[18px] text-black top-[49px]">Arrow</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute bg-white content-stretch flex items-center justify-center left-[78px] p-[10px] top-[360px] w-[262px]">
      <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[24px] text-black">Need service here</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="-translate-x-1/2 absolute bg-white content-stretch flex items-center justify-center left-1/2 p-[10px] top-[185px] w-[315px]">
      <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[24px] text-black">Next</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start leading-[normal] not-italic relative shrink-0 text-black">
      <p className="font-['Inter:Medium',sans-serif] font-medium relative shrink-0 text-[24px]">Address</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[16px]">detailed address</p>
    </div>
  );
}

function Group1() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <div className="bg-[#d9d9d9] col-1 h-[48px] ml-0 mt-0 row-1 w-[65px]" />
      <p className="col-1 font-['Inter:Medium',sans-serif] font-medium leading-[normal] ml-[3px] mt-[13px] not-italic relative row-1 text-[18px] text-black">Search</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex items-center justify-between left-1/2 p-[10px] top-[85px] w-[315px]">
      <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
      <Frame3 />
      <Group1 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="absolute bg-white h-[250px] left-0 overflow-clip top-[602px] w-[393px]">
      <Frame2 />
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[normal] left-[calc(50%+1px)] not-italic text-[32px] text-black text-center top-[8px]">Confirm location</p>
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[normal] left-[calc(50%+0.5px)] not-italic text-[16px] text-black text-center top-[47px]">Drag map to move pin</p>
      <Frame1 />
    </div>
  );
}

export default function AddressConfirmation() {
  return (
    <div className="bg-white relative size-full" data-name="Address confirmation">
      <div className="absolute left-[-251px] size-[852px] top-0" data-name="🌎 Map Maker:  (Dark)">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgMapMakerDark} />
      </div>
      <Group />
      <div className="absolute left-[185px] size-[24px] top-[420px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" fill="var(--fill-0, #D9D9D9)" id="Ellipse 1" r="12" />
        </svg>
      </div>
      <Frame />
      <Frame4 />
    </div>
  );
}