function Group() {
  return (
    <div className="absolute contents left-[24px] top-[36px]">
      <div className="absolute bg-[#d9d9d9] h-[48px] left-[24px] top-[36px] w-[52px]" />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[normal] left-[24px] not-italic text-[18px] text-black top-[49px]">Arrow</p>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex items-end justify-center relative shrink-0 w-full">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[32px] text-black">Payment</p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col items-center left-1/2 top-[40px] w-[315px]">
      <Frame8 />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex items-center p-[10px] relative shrink-0 w-[262px]">
      <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[24px] text-black">Pay using Apple pay</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex items-center p-[10px] relative shrink-0 w-[262px]">
      <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[24px] text-black">Pay using Gpay</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex items-center p-[10px] relative shrink-0 w-[262px]">
      <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[24px] text-black">Pay using credit card</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex items-center p-[10px] relative shrink-0 w-[262px]">
      <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[24px] text-black">Pay using ........</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex items-center p-[10px] relative shrink-0 w-[262px]">
      <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[24px] text-black">Pay using ........</p>
    </div>
  );
}

function Frame7() {
  return (
    <div className="-translate-x-1/2 absolute bottom-[29px] content-stretch flex flex-col gap-[17px] items-start left-[calc(50%+0.5px)]">
      <Frame />
      <Frame1 />
      <Frame2 />
      <Frame3 />
      <Frame4 />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-[242px] top-[125px]">
      <div className="absolute bg-[#d9d9d9] h-[48px] left-[243px] top-[126px] w-[52px]" />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[normal] left-[250px] not-italic text-[18px] text-black top-[139px]">Edit</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-white border border-black border-solid h-[190px] left-1/2 top-[calc(50%-104px)] w-[315px]">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[normal] left-[9px] not-italic text-[24px] text-black top-[12px]">Service address</p>
      <Group1 />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[9px] not-italic text-[16px] text-black top-[49px] w-[300px] whitespace-pre-wrap">Horem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.</p>
    </div>
  );
}

export default function PaymentGateway() {
  return (
    <div className="bg-white relative size-full" data-name="Payment-gateway">
      <Group />
      <Frame6 />
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[normal] left-[calc(50%-77.5px)] not-italic text-[48px] text-black top-[148px]">$1000</p>
      <Frame7 />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[normal] left-[calc(50%-104.5px)] not-italic text-[24px] text-black top-[437px]">Payment methods</p>
      <Frame5 />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[211px] not-italic text-[12px] text-black top-[194px]">breakdown</p>
    </div>
  );
}