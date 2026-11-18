import re, sys, pathlib
root = pathlib.Path(sys.argv[1])
def comp(name):
    return ''.join(p[0].upper()+p[1:] for p in re.split(r'[^a-zA-Z0-9]+', name) if p) + 'Icon'
IMPORT_RE = re.compile(r"import \{ ([^}]*) \} from '@/shared/ui/icon';")
report = []
for path in sorted(root.rglob('*.tsx')):
    rel = path.relative_to(root).as_posix()
    if rel.endswith('.stories.tsx') or rel.startswith('shared/ui/icon/') or rel.startswith('shared/ui/icon-button/'):
        continue
    src = path.read_text(encoding='utf8')
    m = IMPORT_RE.search(src)
    if not m:
        continue
    used = set()
    def fix_tag(tm):
        tag = tm.group(0)
        def lit(mm):
            used.add(mm.group(1)); return f'icon={{{comp(mm.group(1))}}}'
        tag2 = re.sub(r'\bname="([a-z0-9-]+)"', lit, tag)
        def expr(mm):
            inner = re.sub(r"'([a-z0-9-]+)'", lambda q: (used.add(q.group(1)), comp(q.group(1)))[1], mm.group(1))
            return f'icon={{{inner}}}'
        tag2 = re.sub(r'\bname=\{([^{}]*)\}', expr, tag2)
        return tag2
    out = re.sub(r'<Icon\b[^>]*?/>', fix_tag, src, flags=re.S)
    def fix_btn(tm):
        return re.sub(r'\bicon="([a-z0-9-]+)"', lambda mm: (used.add(mm.group(1)), f'icon={{{comp(mm.group(1))}}}')[1], tm.group(0))
    out = re.sub(r'<IconButton\b.*?/>', fix_btn, out, flags=re.S)
    if not used:
        continue
    names = [n.strip() for n in m.group(1).split(',') if n.strip()]
    names = sorted(set(names) | {comp(u) for u in used}, key=lambda s: s.lstrip('type ').lower())
    out = IMPORT_RE.sub(f"import {{ {', '.join(names)} }} from '@/shared/ui/icon';", out, count=1)
    path.write_text(out, encoding='utf8')
    report.append(f"{rel}: {', '.join(f'{u}->{comp(u)}' for u in sorted(used))}")
print('\n'.join(report)); print(len(report), 'files')
