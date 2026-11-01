"""AI 커리큘럼·실습모듈 라이브러리 시트(xlsx 내보내기)를 빌더용 JSON으로 변환한다.

사용법: python scripts/build_module_library.py <시트.xlsx>
출력: public/data/module-library.json

공개 페이지에 필요한 칸만 옮긴다. 원본 링크·정리 구분 같은 내부 칸은 넣지 않는다.
"""
import json
import pathlib
import sys

import openpyxl

OUT = pathlib.Path(__file__).resolve().parent.parent / 'public' / 'data' / 'module-library.json'
GRADE = {'그린': 'g', '블루': 'b', '블랙': 'k'}
INTERNAL = {'승인된 로컬·내부 환경 대안', '외부 준비 후 기관 환경 반입'}


def rows(wb, name):
    all_rows = list(wb[name].iter_rows(values_only=True))
    head = [c for c in all_rows[0] if c]
    return [dict(zip(head, r)) for r in all_rows[1:] if r and r[0]]


def text(v):
    return str(v or '').strip()


def main(path):
    wb = openpyxl.load_workbook(path, read_only=True, data_only=True)
    themes = [
        {'name': text(r['대주제']), 'desc': text(r['다루는 내용'])}
        for r in rows(wb, '01_대주제')
    ]
    theme_index = {t['name']: i for i, t in enumerate(themes)}

    modules = {}
    for r in rows(wb, '02_실습모듈'):
        modules[r['모듈ID']] = {
            'id': r['모듈ID'],
            't': theme_index[r['대주제']],
            'name': text(r['실습모듈']),
            'desc': text(r['쉬운 설명']),
            'out': text(r['결과물']),
            'g': GRADE[r['권장등급(제안)']],
            'tools': '',
            'inner': False,
            'parent': text(r.get('연결모듈ID')),
            'pub': [],
            'biz': [],
            'tasks': [],
        }

    for r in rows(wb, '04_기술준비'):
        m = modules[r['모듈ID']]
        m['tools'] = text(r['기술·도구 예시'])
        m['inner'] = text(r['실행환경']) in INTERNAL

    for r in rows(wb, '03_업무활용'):
        key = 'pub' if r['활용 분야'] == '행정·공공' else 'biz'
        modules[r['모듈ID']][key].append([text(r['직무·부서']), text(r['어디에 어떻게 쓰는가'])])

    for r in rows(wb, '05_실습과제'):
        modules[r['모듈ID']]['tasks'].append(text(r['직접 해볼 일']))

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        json.dumps({'themes': themes, 'modules': list(modules.values())}, ensure_ascii=False, separators=(',', ':')),
        encoding='utf-8',
    )
    print(f'{len(modules)} modules → {OUT} ({OUT.stat().st_size // 1024} KB)')


if __name__ == '__main__':
    main(sys.argv[1])
