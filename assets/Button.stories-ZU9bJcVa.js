import{j as r}from"./iframe-y8rf4EuS.js";import{B as e}from"./Button-BmQWdT4B.js";import"./preload-helper-DHFrVIEf.js";import"./button.variants-DVtoWReC.js";import"./index-B8k91cqS.js";import"./clsx-B-dksMZM.js";const L={component:e,tags:["autodocs"],parameters:{layout:"centered",docs:{description:{component:"다양한 상황에서 사용할 수 있는 범용 버튼 컴포넌트입니다. `variant`와 `size`로 시각적 스타일을 조정하고, `display`로 인라인/블록 레이아웃을 선택하세요."}}},argTypes:{children:{control:"text",description:"버튼 내부에 표시할 텍스트 또는 콘텐츠입니다."},variant:{description:'버튼의 시각적 스타일을 결정합니다. `display="block"`일 때는 `primary`, `secondary`만 사용 가능합니다.'},size:{description:'버튼의 크기를 결정합니다. `display="block"`일 때는 `md`로 고정됩니다.'},disabled:{description:"true일 때 버튼을 비활성화합니다. 회색으로 표시되며 클릭이 불가능합니다. `loading`이 true이면 자동으로 비활성화됩니다."},loading:{description:"true일 때 로딩 상태로 전환됩니다. 버튼이 자동으로 비활성화되고 `loadingText`를 표시합니다."},loadingText:{description:'`loading`이 true일 때 표시할 텍스트입니다. 기본값은 `"로딩 중..."`입니다.'}},args:{children:"버튼",variant:"primary",size:"md"}},t={},o={args:{variant:"secondary"}},i={args:{variant:"strokeGray"}},l={args:{variant:"strokePrimary"}},d={args:{size:"xs"}},c={args:{size:"sm"}},p={args:{size:"lg"}},m={args:{disabled:!0}},g={args:{loading:!0}},u={args:{loading:!0,loadingText:"저장 중..."}},y={name:"Variants — 한눈에",parameters:{controls:{disable:!0}},render:()=>r.jsx("div",{style:{display:"flex",alignItems:"center",gap:"12px",flexWrap:"wrap"},children:["primary","secondary","strokeGray","strokePrimary"].map(a=>r.jsx(e,{variant:a,children:a},a))})},x={name:"Sizes — 한눈에",parameters:{controls:{disable:!0}},render:()=>r.jsx("div",{style:{display:"flex",alignItems:"center",gap:"12px",flexWrap:"wrap"},children:["xs","sm","md","lg"].map(a=>r.jsx(e,{variant:"primary",size:a,children:a.toUpperCase()},a))})},v={name:"States — 한눈에",parameters:{controls:{disable:!0}},render:()=>r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px",flexWrap:"wrap"},children:[r.jsx(e,{variant:"primary",children:"Default"}),r.jsx(e,{variant:"primary",loading:!0,children:"Loading"}),r.jsx(e,{variant:"primary",loading:!0,loadingText:"저장 중...",children:"저장 중..."}),r.jsx(e,{variant:"primary",disabled:!0,children:"Disabled"})]})},f={render:({children:a,disabled:n,loading:s,loadingText:h})=>r.jsx("div",{style:{width:"320px"},children:r.jsx(e,{display:"block",variant:"primary",disabled:n,loading:s,loadingText:h,children:a})}),argTypes:{display:{control:!1},variant:{control:!1},size:{control:!1}}},S={render:({children:a,disabled:n,loading:s,loadingText:h})=>r.jsx("div",{style:{width:"320px"},children:r.jsx(e,{display:"block",variant:"secondary",disabled:n,loading:s,loadingText:h,children:a})}),argTypes:{display:{control:!1},variant:{control:!1},size:{control:!1}}},b={render:({children:a,disabled:n,loadingText:s})=>r.jsx("div",{style:{width:"320px"},children:r.jsx(e,{display:"block",variant:"primary",loading:!0,disabled:n,loadingText:s,children:a})}),argTypes:{display:{control:!1},variant:{control:!1},size:{control:!1},loading:{control:!1}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:"{}",...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "secondary"
  }
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "strokeGray"
  }
}`,...i.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "strokePrimary"
  }
}`,...l.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    size: "xs"
  }
}`,...d.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    size: "sm"
  }
}`,...c.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    size: "lg"
  }
}`,...p.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true
  }
}`,...m.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    loading: true
  }
}`,...g.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    loading: true,
    loadingText: "저장 중..."
  }
}`,...u.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  name: "Variants — 한눈에",
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <div style={{
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap"
  }}>
            {(["primary", "secondary", "strokeGray", "strokePrimary"] as const).map(variant => <Button key={variant} variant={variant}>
                        {variant}
                    </Button>)}
        </div>
}`,...y.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: "Sizes — 한눈에",
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <div style={{
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap"
  }}>
            {(["xs", "sm", "md", "lg"] as const).map(size => <Button key={size} variant="primary" size={size}>
                    {size.toUpperCase()}
                </Button>)}
        </div>
}`,...x.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  name: "States — 한눈에",
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <div style={{
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap"
  }}>
            <Button variant="primary">Default</Button>
            <Button variant="primary" loading>
                Loading
            </Button>
            <Button variant="primary" loading loadingText="저장 중...">
                저장 중...
            </Button>
            <Button variant="primary" disabled>
                Disabled
            </Button>
        </div>
}`,...v.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: ({
    children,
    disabled,
    loading,
    loadingText
  }) => <div style={{
    width: "320px"
  }}>
            <Button display="block" variant="primary" disabled={disabled} loading={loading} loadingText={loadingText}>
                {children}
            </Button>
        </div>,
  argTypes: {
    display: {
      control: false
    },
    variant: {
      control: false
    },
    size: {
      control: false
    }
  }
}`,...f.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: ({
    children,
    disabled,
    loading,
    loadingText
  }) => <div style={{
    width: "320px"
  }}>
            <Button display="block" variant="secondary" disabled={disabled} loading={loading} loadingText={loadingText}>
                {children}
            </Button>
        </div>,
  argTypes: {
    display: {
      control: false
    },
    variant: {
      control: false
    },
    size: {
      control: false
    }
  }
}`,...S.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: ({
    children,
    disabled,
    loadingText
  }) => <div style={{
    width: "320px"
  }}>
            <Button display="block" variant="primary" loading disabled={disabled} loadingText={loadingText}>
                {children}
            </Button>
        </div>,
  argTypes: {
    display: {
      control: false
    },
    variant: {
      control: false
    },
    size: {
      control: false
    },
    loading: {
      control: false
    }
  }
}`,...b.parameters?.docs?.source}}};const P=["Primary","Secondary","StrokeGray","StrokePrimary","ExtraSmall","Small","Large","Disabled","Loading","LoadingWithCustomText","AllVariants","AllSizes","AllStates","Block","BlockSecondary","BlockLoading"];export{x as AllSizes,v as AllStates,y as AllVariants,f as Block,b as BlockLoading,S as BlockSecondary,m as Disabled,d as ExtraSmall,p as Large,g as Loading,u as LoadingWithCustomText,t as Primary,o as Secondary,c as Small,i as StrokeGray,l as StrokePrimary,P as __namedExportsOrder,L as default};
