/**
 * @author 박태훈
 * @since 2021-12-01
 *
 */
class UtilGrid extends tui.Grid {
    constructor(opt) {
        super(opt);
        this.option = opt;
    }

    gridInit() {
        this.option.data = [];
        this.resetData(this.option.data);
    }

    setOptColumns(columns) {
        this.setColumns(columns);
        this.option.columns = columns;
    }

    getNames() {
        let names = [];
        this.option.columns.forEach((item, idx) => {
            names.push(item.name);
        });
        return names;
    }

    getHeaders() {
        let headers = [];
        this.option.columns.forEach((item, idx) => {
            headers.push(item.header);
        });
        return headers;
    }

    getSumColumns() {
        const obj = this.option.summary.columnContent;
        const arr = [];
        for (let o in obj) {
            try {
                obj[o].template();
            } catch (e) {
                arr.push(o);
            }
        }
        return arr;
    }

    makeGrid(data = this.option.data) {
        let gridData = [];
        let rowData = {};
        data.forEach((item, idx) => {
            rowData = {};
            this.getNames().forEach((citem, cidx) => {
                rowData[citem] = item[citem];
            });
            gridData.push(rowData);
        });
        this.option.data = gridData;
        this.resetData(gridData);
    }

    makeSubtotalGrid(data, standard) {
        const summary = this.option.summary.columnContent;
        let newData = [];
        let obj = {};

        obj[this.getNames()[0]] = '소계';

        for (let key in summary) {
            try {
                summary[key].template();
            } catch (e) {
                obj[key] = 0;
            }
        }

        data.forEach((item, idx) => {
            newData.push(item);

            for (let o in obj) {
                if (typeof obj[o] !== 'string') obj[o] += item[o];
            }

            if (typeof data[idx + 1] === 'undefined' || data[idx + 1][standard] !== item[standard]) {
                const row = {};

                for (let o in obj) {
                    row[o] = obj[o];
                }

                newData.push(row);

                for (let o in obj) {
                    if (typeof obj[o] !== 'string') obj[o] = 0;
                }
            }
        });

        this.makeGrid(newData);

        let condition = {};
        condition[this.getNames()[0]] = '소계';

        this.findRows(condition).forEach((item, idx) => {
            this.addRowClassName(item.rowKey, 'summary-bg');
        });
    }
}

class UtilTreeGrid extends tui.Grid {
    // 생성자
    constructor(opt, depth, category) {
        /**
         * tui-grid 4.2.0이상 버전에서는 contextMenu가 기본적으로 정의 되어있다.
         * 기본적으로 정의된 contextMenu를 커스텀 하기위해 null처리를 해준다.
         */
        opt.contextMenu = null;

        super(opt); // 그리드 생성

        this.depth = depth;
        this.category = category;

        /**
         * Custom ContextMenu
         *
         * 참고 : https://nhn.github.io/tui.context-menu/latest/tutorial-example01-basic
         */
        const contextMenu = document.createElement('div');
        contextMenu.id = 'contextMenu';
        this.el.appendChild(contextMenu);

        // contextmenu 객체
        let menu = null;
        // 그리드 클릭 이벤트 정의
        this.on('mousedown', ({ rowKey, nativeEvent, columnName }) => {
            if (menu) menu.destroy(); // 객체가 생성되어 있을 경우 객체 삭제
            if (!columnName) return; // 그리드 내의 row가 아닌 빈 공간에 클릭했을 시 return

            switch (nativeEvent.button) {
                // 좌클릭
                case 0: {
                    // 클릭한 cell이 트리 칼럼일 경우
                    if (columnName === this.store.column.treeColumnName) {
                        // 자체적으로 열고 닫는 기능이 걸려있는 태그
                        if (nativeEvent.target.tagName === 'BUTTON' || nativeEvent.target.tagName === 'I') {
                            break;
                        }
                        // 열고 닫는 기능
                        if (this.getRow(rowKey)._attributes.expanded) {
                            // 열려 있는 경우
                            this.collapse(rowKey);
                        } else {
                            // 닫혀 있는 경우
                            this.expand(rowKey);
                        }
                    }
                    break;
                }
                // 우클릭
                case 2: {
                    // contextmenu 객체 생성
                    menu = new tui.ContextMenu(contextMenu);
                    // 클릭한 셀이 마지막 depth인지 체크
                    const condition = this.getDepth(rowKey) === this.depth;
                    // contextmenu 생성
                    menu.register(
                        '#grid', // contextmenu를 동작 시킬 대상
                        (event) => this.clickContextMenu(rowKey, event), // callback
                        [
                            // 메뉴 정의
                            { title: '행 삭제', command: 0 },
                            {
                                title: '행 추가',
                                menu: [
                                    { title: '같은 레벨', command: 11 },
                                    {
                                        title: '자식 레벨',
                                        command: 12,
                                        disable: condition, // 클릭한 셀이 마지막 depth인 경우 disable: true
                                    },
                                ],
                            },
                        ]
                    );
                    break;
                }
            }
        });

        // 그리드 수정 이벤트 정의
        this.on('editingFinish', ({ rowKey, value, columnName }) => {
            // code 칼럼 수정 시
            if (columnName === 'code') {
                // 자식 행 배열찾기
                const arr = this.getRow(rowKey)._children;
                // 자식 행이 존재할 경우
                if (arr.length) {
                    // 자식 행들의 motherCode를 수정한 code로 변경
                    arr.forEach(({ rowKey }) => {
                        this.setValue(rowKey, 'motherCode', value);
                    });
                }
            }
        });
    }

    // 그리드 데이터 만들기
    makeTreeGrid(data) {
        // 임시 배열
        const tempArr = [];

        // 임시 배열 내에 depth만큼의 배열 생성
        for (let i = 0; i < this.depth; i++) {
            tempArr.push([]);
        }

        // 데이터 정리 밑 작업
        data.forEach((item) => {
            item._children = []; // 자식 행이 담길 배열
            item._attributes = { expanded: true }; // 데이터 추가시 자동 열기
            item[this.store.column.treeColumnName] = this.category[item.depth]; // treecolumn에 들어갈 내용

            /**
             * 1. 임시 배열 내의 각 배열에 (tempArr = [[],[], ...])
             * 2. depth 순서대로 요소 넣기 (tempArr = [[depth=1, depth=1], [depth=2, depth=2], ...])
             *      ** 배열의 요소는 index가 0부터 시작, 따라서 depth-1의 자리에 요소들을 넣는다.
             */
            tempArr[Number(item.depth) - 1].push(item);
        });

        // tempArr의 데이터로 사용가능한 데이터 만드는 함수 호출
        this.makeTreeGridData(tempArr, this.depth);

        // 자식 행이 없는 데이터들의 _children 요소 삭제 함수 호출
        this.removeEmptyChildren(tempArr[0]);

        // 그리드 데이터 작성
        grid.resetData(tempArr[0]);
    }

    // 그리드에서 사용 가능한 데이터 만들기(재귀함수)
    makeTreeGridData(arr, depth) {
        // arr의 index가 -1이 되는 경우 에러가 발생
        try {
            // index는 0부터 시작, depth-1이 index가 된다.
            // 자식 행의 depth는 부모 행의 depth보다 1크다. (최상위 depth = 1)
            arr[depth - 1].forEach((child) => {
                arr[depth - 2].forEach((parent) => {
                    // 자식 행의 부모코드가 부모의 코드와 같을때
                    if (child.motherCode === parent.code) {
                        parent._children.push(child);
                    }
                });
            });

            // 자기 자신 호출
            this.makeTreeGridData(arr, depth - 1);
        } catch {}
    }

    // 자식 행이 없는 데이터들의 _children 요소 삭제(재귀함수)
    removeEmptyChildren(arr) {
        arr.forEach((item) => {
            if (item._children.length === 0) {
                // 자식 행이 없을 경우
                delete item._children;
            } else {
                // 자식 행이 있을 경우
                // 자식 행의 자식 행 찾기
                this.removeEmptyChildren(item._children);
            }
        });
    }

    // contextmenu callback
    clickContextMenu(rowKey, { target }) {
        const currentRow = this.getRow(rowKey); // 현재 행
        const parentRow = this.getParentRow(rowKey); // 부모 행
        // 메뉴 생성시에 부여한 command 값 활용
        switch (Number(target.getAttribute('data-command'))) {
            // 행 삭제
            case 0: {
                this.removeTreeRow(rowKey);
                break;
            }
            // 같은 레벨 행 추가
            case 11: {
                if (Number(currentRow.depth) === 1) {
                    // 최상위 depth일때
                    this.addRow(currentRow, true);
                } else {
                    // 부모 행 = 현재 행의 부모 행
                    this.addRow(parentRow);
                }
                break;
            }
            // 자식 레벨 행 추가
            case 12: {
                // 부모 행 = 현재 행
                this.addRow(currentRow);
                break;
            }
        }
    }

    addRow(parentRow, isHighest = false) {
        // 필수 데이터 세팅
        const row = {};
        // depth 값 설정 : 최상위 행 일 경우 자기자신 depth, 아닐 경우 자기자신 depth + 1
        row['depth'] = isHighest ? Number(parentRow.depth) : Number(parentRow.depth) + 1;
        // treecolunm 값 설정
        row[this.store.column.treeColumnName] = this.category[row['depth']];
        // 부모코드 값 설정 : 최상위 행 일 경우 '', 아닐 경우 부모 행의 code
        row['motherCode'] = isHighest ? '' : parentRow.code;
        // 행 추가 : 최상위 행 일 경우 appendRow, 아닐 경우 appendTreeRow
        isHighest ? this.appendRow(row) : this.appendTreeRow(row, { parentRowKey: parentRow.rowKey });
    }
}

class Util {
    constructor() {}

    static formToJson(form) {
        const data = new FormData(form);
        const keys = [];
        const values = [];
        const obj = {};

        for (let item of data.keys()) {
            keys.push(item);
        }
        for (let item of data.values()) {
            values.push(item);
        }

        keys.forEach((item, idx) => {
            obj[item] = values[idx];
        });

        return obj;
    }

    static ajax(url, data = {}) {
        let result;
        $.ajax({
            url: url,
            method: 'post',
            data: JSON.stringify(data),
            contentType: 'application/json;charset="utf-8"',
            dataType: 'json',
            async: false,
            success: (data) => {
                result = data;
            },
            error: (err) => {
                result = err;
            },
        });
        return result;
    }

    static async getFetch(url) {
        const res = await fetch(url, {
            method: 'GET',
        });
        const resData = await res.json();
        if (res.ok) return resData;
        else throw res;
    }

    static async deleteFetch(url) {
        const res = await fetch(url, {
            method: 'DELETE',
        });
        const resData = await res.json();
        if (res.ok) return resData;
        else throw res;
    }

    static async postFetch(url, data) {
        const opt = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: data,
        };
        const res = await fetch(url, opt);
        const resData = await res.json();
        if (res.ok) return resData;
        else throw res;
    }

    static async putFetch(url, data) {
        const opt = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: data,
        };
        const res = await fetch(url, opt);
        const resData = await res.json();
        if (res.ok) return resData;
        else throw res;
    }

    static async excelFetch(url, data) {
        const opt = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: data,
        };
        const res = await fetch(url, opt);
        const fileName = res.headers.get('Content-Disposition');
        const resData = await res.blob();
        if (res.ok) {
            const url = window.URL.createObjectURL(resData);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } else throw res;
    }

    static NumberReg() {
        return /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g;
    }

    static today = new Date();

    static weekAgo = new Date() - 7 * 24 * 60 * 60 * 1000;

    static monthAgo = new Date() - 30 * 24 * 60 * 60 * 1000;
}
