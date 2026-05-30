import{j as e}from"./iframe-B3vk0f3t.js";import{B as s,c as h}from"./card-bg-f1Gg44_p.js";import{C as r}from"./card-Bv4FeMvv.js";import"./preload-helper-DHFrVIEf.js";import"./cn-oknOcaYA.js";import"./clsx-B-dksMZM.js";import"./index-B8k91cqS.js";const T={title:"Shared/UI/Card/Card",component:r,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{size:{control:"select",options:["sm","md","lg"],description:"카드 패딩 및 모서리 크기",table:{type:{summary:"'sm' | 'md' | 'lg'"},defaultValue:{summary:"md"}}},className:{control:"text",description:"추가 CSS 클래스"},children:{table:{disable:!0}}}},d={name:"기본",args:{size:"md"},render:a=>e.jsxs(r,{...a,children:[e.jsxs(r.Header,{children:[e.jsx(r.Title,{children:"카드 제목"}),e.jsx(r.Link,{to:".",children:"더보기"})]}),e.jsx("p",{className:"text-sm text-gray-700",children:"카드 본문 내용이 들어갑니다."})]})},t={name:"크기 - sm",args:{size:"sm"},render:a=>e.jsxs(r,{...a,children:[e.jsx(r.Header,{children:e.jsx(r.Title,{children:"작은 카드"})}),e.jsx("p",{className:"text-sm text-gray-700",children:"sm 사이즈의 카드입니다."})]})},m={name:"크기 - md (기본)",args:{size:"md"},render:a=>e.jsxs(r,{...a,children:[e.jsx(r.Header,{children:e.jsx(r.Title,{children:"중간 카드"})}),e.jsx("p",{className:"text-sm text-gray-700",children:"md 사이즈의 카드입니다."})]})},i={name:"크기 - lg",args:{size:"lg"},render:a=>e.jsxs(r,{...a,children:[e.jsx(r.Header,{children:e.jsx(r.Title,{children:"큰 카드"})}),e.jsx("p",{className:"text-sm text-gray-700",children:"lg 사이즈의 카드입니다."})]})},c={name:"헤더 + 링크",args:{size:"md"},render:a=>e.jsxs(r,{...a,children:[e.jsxs(r.Header,{children:[e.jsx(r.Title,{children:"최근 활동"}),e.jsx(r.Link,{to:".",children:"전체보기"})]}),e.jsx("p",{className:"text-sm text-gray-700",children:"최근 활동 목록이 들어갑니다."})]})},l={name:"헤더만 포함",args:{size:"md"},render:a=>e.jsxs(r,{...a,children:[e.jsx(r.Header,{children:e.jsx(r.Title,{children:"알림"})}),e.jsx("p",{className:"text-sm text-gray-700",children:"링크 없이 헤더 타이틀만 사용하는 카드입니다."})]})},g={name:"컨텐츠만 포함",args:{size:"md"},render:a=>e.jsx(r,{...a,children:e.jsx("p",{className:"text-sm text-gray-700",children:"헤더 없이 본문 컨텐츠만 담은 카드입니다."})})},o={name:"BgCard - 기본",args:{size:"md"},render:({size:a,className:n})=>e.jsxs(s,{size:a??"md",className:n,backgroundImage:h,children:[e.jsxs(s.Header,{children:[e.jsx(s.Title,{className:"text-white",children:"카드 제목"}),e.jsx(s.Link,{to:".",className:"text-white/70",children:"더보기"})]}),e.jsx("p",{className:"text-sm text-white/80",children:"카드 본문 내용이 들어갑니다."})]})},x={name:"BgCard - sm",args:{size:"sm"},render:({size:a,className:n})=>e.jsxs(s,{size:a??"sm",className:n,backgroundImage:h,children:[e.jsx(s.Header,{children:e.jsx(s.Title,{className:"text-white",children:"작은 카드"})}),e.jsx("p",{className:"text-sm text-white/80",children:"sm 사이즈의 배경 카드입니다."})]})},p={name:"BgCard - lg",args:{size:"lg"},render:({size:a,className:n})=>e.jsxs(s,{size:a??"lg",className:n,backgroundImage:h,children:[e.jsx(s.Header,{children:e.jsx(s.Title,{className:"text-white",children:"큰 카드"})}),e.jsx("p",{className:"text-sm text-white/80",children:"lg 사이즈의 배경 카드입니다."})]})},C={name:"BgCard - 컨텐츠만",args:{size:"md"},render:({size:a,className:n})=>e.jsx(s,{size:a??"md",className:n,backgroundImage:h,children:e.jsx("p",{className:"text-sm text-white/80",children:"헤더 없이 본문만 담은 배경 카드입니다."})})};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: "기본",
  args: {
    size: "md"
  },
  render: args => <Card {...args}>
            <Card.Header>
                <Card.Title>카드 제목</Card.Title>
                <Card.Link to=".">더보기</Card.Link>
            </Card.Header>
            <p className="text-sm text-gray-700">카드 본문 내용이 들어갑니다.</p>
        </Card>
}`,...d.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  name: "크기 - sm",
  args: {
    size: "sm"
  },
  render: args => <Card {...args}>
            <Card.Header>
                <Card.Title>작은 카드</Card.Title>
            </Card.Header>
            <p className="text-sm text-gray-700">sm 사이즈의 카드입니다.</p>
        </Card>
}`,...t.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: "크기 - md (기본)",
  args: {
    size: "md"
  },
  render: args => <Card {...args}>
            <Card.Header>
                <Card.Title>중간 카드</Card.Title>
            </Card.Header>
            <p className="text-sm text-gray-700">md 사이즈의 카드입니다.</p>
        </Card>
}`,...m.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  name: "크기 - lg",
  args: {
    size: "lg"
  },
  render: args => <Card {...args}>
            <Card.Header>
                <Card.Title>큰 카드</Card.Title>
            </Card.Header>
            <p className="text-sm text-gray-700">lg 사이즈의 카드입니다.</p>
        </Card>
}`,...i.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: "헤더 + 링크",
  args: {
    size: "md"
  },
  render: args => <Card {...args}>
            <Card.Header>
                <Card.Title>최근 활동</Card.Title>
                <Card.Link to=".">전체보기</Card.Link>
            </Card.Header>
            <p className="text-sm text-gray-700">최근 활동 목록이 들어갑니다.</p>
        </Card>
}`,...c.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  name: "헤더만 포함",
  args: {
    size: "md"
  },
  render: args => <Card {...args}>
            <Card.Header>
                <Card.Title>알림</Card.Title>
            </Card.Header>
            <p className="text-sm text-gray-700">
                링크 없이 헤더 타이틀만 사용하는 카드입니다.
            </p>
        </Card>
}`,...l.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: "컨텐츠만 포함",
  args: {
    size: "md"
  },
  render: args => <Card {...args}>
            <p className="text-sm text-gray-700">
                헤더 없이 본문 컨텐츠만 담은 카드입니다.
            </p>
        </Card>
}`,...g.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: "BgCard - 기본",
  args: {
    size: "md"
  },
  render: ({
    size,
    className
  }) => <BgCard size={size ?? "md"} className={className} backgroundImage={cardBg}>
            <BgCard.Header>
                <BgCard.Title className="text-white">카드 제목</BgCard.Title>
                <BgCard.Link to="." className="text-white/70">
                    더보기
                </BgCard.Link>
            </BgCard.Header>
            <p className="text-sm text-white/80">카드 본문 내용이 들어갑니다.</p>
        </BgCard>
}`,...o.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: "BgCard - sm",
  args: {
    size: "sm"
  },
  render: ({
    size,
    className
  }) => <BgCard size={size ?? "sm"} className={className} backgroundImage={cardBg}>
            <BgCard.Header>
                <BgCard.Title className="text-white">작은 카드</BgCard.Title>
            </BgCard.Header>
            <p className="text-sm text-white/80">sm 사이즈의 배경 카드입니다.</p>
        </BgCard>
}`,...x.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  name: "BgCard - lg",
  args: {
    size: "lg"
  },
  render: ({
    size,
    className
  }) => <BgCard size={size ?? "lg"} className={className} backgroundImage={cardBg}>
            <BgCard.Header>
                <BgCard.Title className="text-white">큰 카드</BgCard.Title>
            </BgCard.Header>
            <p className="text-sm text-white/80">lg 사이즈의 배경 카드입니다.</p>
        </BgCard>
}`,...p.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  name: "BgCard - 컨텐츠만",
  args: {
    size: "md"
  },
  render: ({
    size,
    className
  }) => <BgCard size={size ?? "md"} className={className} backgroundImage={cardBg}>
            <p className="text-sm text-white/80">
                헤더 없이 본문만 담은 배경 카드입니다.
            </p>
        </BgCard>
}`,...C.parameters?.docs?.source}}};const y=["Default","SizeSmall","SizeMedium","SizeLarge","WithHeaderAndLink","WithHeaderOnly","ContentOnly","BgCardDefault","BgCardSizeSmall","BgCardSizeLarge","BgCardContentOnly"];export{C as BgCardContentOnly,o as BgCardDefault,p as BgCardSizeLarge,x as BgCardSizeSmall,g as ContentOnly,d as Default,i as SizeLarge,m as SizeMedium,t as SizeSmall,c as WithHeaderAndLink,l as WithHeaderOnly,y as __namedExportsOrder,T as default};
