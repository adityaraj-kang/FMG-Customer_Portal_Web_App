function Frame5() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start leading-[normal] not-italic relative shrink-0 text-black">
      <p className="font-['Inter:Medium',sans-serif] font-medium relative shrink-0 text-[24px]">User’s address</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[16px]">User name</p>
    </div>
  );
}

function Group() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <div className="bg-[#d9d9d9] col-1 h-[48px] ml-0 mt-0 row-1 w-[65px]" />
      <p className="col-1 font-['Inter:Medium',sans-serif] font-medium leading-[normal] ml-[7px] mt-[13px] not-italic relative row-1 text-[18px] text-black">Arrow</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex items-center justify-between left-1/2 p-[10px] top-[117px] w-[315px]">
      <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
      <Frame5 />
      <Group />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start leading-[normal] not-italic relative shrink-0 text-black">
      <p className="font-['Inter:Medium',sans-serif] font-medium relative shrink-0 text-[24px]">Vendor’s address</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[16px]">Vendor name</p>
    </div>
  );
}

function Group1() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <div className="bg-[#d9d9d9] col-1 h-[48px] ml-0 mt-0 row-1 w-[65px]" />
      <p className="col-1 font-['Inter:Medium',sans-serif] font-medium leading-[normal] ml-[7px] mt-[13px] not-italic relative row-1 text-[18px] text-black">Arrow</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex items-center justify-between left-1/2 p-[10px] top-[210px] w-[315px]">
      <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
      <Frame6 />
      <Group1 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[24px] text-black">Time</p>
    </div>
  );
}

function Group2() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <div className="bg-[#d9d9d9] col-1 h-[48px] ml-0 mt-0 row-1 w-[65px]" />
      <p className="col-1 font-['Inter:Medium',sans-serif] font-medium leading-[normal] ml-[7px] mt-[13px] not-italic relative row-1 text-[18px] text-black">Price</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex items-center justify-between left-1/2 p-[10px] top-[374px] w-[315px]">
      <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
      <Frame7 />
      <Group2 />
    </div>
  );
}

function Frame() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-white border border-black border-solid h-[190px] leading-[normal] left-1/2 not-italic text-black top-[calc(50%+160px)] w-[315px]">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium left-[9px] text-[24px] top-[12px]">Review service guidelines</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal left-[9px] text-[16px] top-[49px] w-[300px] whitespace-pre-wrap">Horem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.</p>
    </div>
  );
}

function Frame9() {
  return (
    <div className="absolute bg-white h-[852px] left-0 overflow-clip top-0 w-[393px]">
      <Frame1 />
      <Frame2 />
      <Frame3 />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[normal] left-[calc(50%-157.5px)] not-italic text-[24px] text-black top-[337px]">Service speed</p>
      <Frame />
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

function Frame8() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start leading-[normal] not-italic relative shrink-0 text-black">
      <p className="font-['Inter:Medium',sans-serif] font-medium relative shrink-0 text-[24px]">Price</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[16px]">Time</p>
    </div>
  );
}

function Group4() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <div className="bg-[#d9d9d9] col-1 h-[48px] ml-0 mt-0 row-1 w-[74px]" />
      <p className="col-1 font-['Inter:Medium',sans-serif] font-medium leading-[normal] ml-[3px] mt-[13px] not-italic relative row-1 text-[18px] text-black">Confirm</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute content-stretch flex items-center justify-between left-1/2 p-[10px] top-[calc(50%+0.5px)] w-[315px]">
      <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
      <Frame8 />
      <Group4 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="absolute bg-white border border-black border-solid h-[165px] left-0 overflow-clip top-[687px] w-[393px]">
      <Frame4 />
    </div>
  );
}

export default function Verification() {
  return (
    <div className="bg-white relative size-full" data-name="Verification">
      <Frame9 />
      <Group3 />
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[normal] left-[calc(50%+0.5px)] not-italic text-[32px] text-black text-center top-[40px]">Service details</p>
      <Frame10 />
    </div>
  );
}