/**
 * @author 박태훈
 * @since 2021-12-23
 *
 */

// 체크박스 하나만 선택하게 하는 class
class SelectOneCheckBox {
    constructor(props) {
        const { grid, rowKey, columnInfo, value } = props;

        const el = document.createElement('input');
        el.className = 'hidden-input grid-select-one-checkbox';
        el.id = String(rowKey);
        el.type = 'checkbox';

        this.grid = grid;
        this.columnInfo = columnInfo;
        this.rowKey = rowKey;
        this.value = value;
        this.el = el;
        this.render(props);

        this.el.addEventListener('change', () => this.selectOne());
    }

    getElement() {
        return this.el;
    }

    selectOne() {
        document.querySelectorAll('.grid-select-one-checkbox').forEach((item) => {
            item.checked = false;
            this.grid.setValue(this.rowKey, this.columnInfo.name, '0');
        });
        this.el.checked = true;
        this.grid.setValue(this.rowKey, this.columnInfo.name, '1');
    }

    // 셀의 값이 변경 될 때마다 실행(최초생성시에 mounted보다 먼저 실행됨)
    // ***** 주의 ******
    // grid.disableRow()와 같이 grid의 상태나 값을 변경하는 함수를
    // render()내부에서 실행하면 무한루프에 빠짐.
    render(props) {
        if (props.value === '1') this.el.checked = true;
        else this.el.checked = false;
    }
}

// 체크시 해당하는 행 disable class
class DisableCheckBox {
    constructor(props) {
        const { grid, rowKey, columnInfo, value } = props;

        const el = document.createElement('input');
        el.className = 'hidden-input';
        el.id = String(rowKey);
        el.type = 'checkbox';

        this.grid = grid;
        this.columnInfo = columnInfo;
        this.rowKey = rowKey;
        this.value = value;
        this.el = el;
        this.render(props);

        this.el.addEventListener('change', () => {
            this.checkStatus();
        });
    }

    getElement() {
        return this.el;
    }

    mounted() {
        this.checkStatus();
    }

    checkStatus() {
        if (this.el.checked) {
            this.grid.disableRow(this.rowKey);
            this.grid.setValue(this.rowKey, this.columnInfo.name, '1');
        } else {
            this.grid.enableRow(this.rowKey);
            this.grid.setValue(this.rowKey, this.columnInfo.name, '0');
        }
    }

    // 셀의 값이 변경 될 때마다 실행(최초생성시에 mounted보다 먼저 실행됨)
    // ***** 주의 ******
    // grid.disableRow()와 같이 grid의 상태나 값을 변경하는 함수를
    // render()내부에서 실행하면 무한루프에 빠짐.
    render(props) {
        if (props.value === '1') {
            this.el.checked = true;
        } else {
            this.el.checked = false;
        }
    }
}

// 숫자 유효성 검사 class
class ValidateNumber {
    constructor(props) {
        const el = document.createElement('input');
        el.type = 'text';
        el.value = String(props.value);

        this.el = el;
        this.render(props);
    }

    getElement() {
        return this.el;
    }

    getValue() {
        if (Number(this.el.value) >= 0 && typeof Number(this.el.value) !== 'NaN') {
            return this.el.value;
        } else {
            toastr.warning('입력 값을 확인해 주세요.');
        }
    }

    mounted() {
        this.el.select();
    }

    // 셀의 값이 변경 될 때마다 실행(최초생성시에 mounted보다 먼저 실행됨)
    // ***** 주의 ******
    // grid.disableRow()와 같이 grid의 상태나 값을 변경하는 함수를
    // render()내부에서 실행하면 무한루프에 빠짐.
    render(props) {
        console.log(props);
    }
}

class RowNumberRenderer {
    constructor(props) {
        const el = document.createElement('span');
        el.innerHTML = `${props.formattedValue}`;
        this.el = el;
    }

    getElement() {
        return this.el;
    }

    render(props) {
        this.el.innerHTML = `${props.formattedValue}`;
    }
}

class CustomCheckboxRenderer {
    constructor(props) {
        const { grid, rowKey, columnInfo, value } = props;
        const label = document.createElement('checkbox');
        /*         const { disabled } = props.columnInfo.renderer.options; */
        label.className = 'checkbox';
        //label.setAttribute('for', String(rowKey));

        const hiddenInput = document.createElement('input');
        hiddenInput.className = 'hidden-input';
        hiddenInput.id = String(rowKey);

        hiddenInput.setAttribute('data-check-val', '0');

        label.appendChild(hiddenInput);

        hiddenInput.type = 'checkbox';
        hiddenInput.addEventListener('change', () => {
            if (hiddenInput.checked) {
                hiddenInput.setAttribute('data-check-val', '1');
                grid.setValue(rowKey, columnInfo.name, '1');
            } else {
                hiddenInput.setAttribute('data-check-val', '0');
                grid.setValue(rowKey, columnInfo.name, '0');
            }
            try {
                fnCustomChkboxChange();
            } catch (e) {}
        });

        this.el = label;

        this.render(props);
    }

    getElement() {
        return this.el;
    }

    render(props) {
        const hiddenInput = this.el.querySelector('.hidden-input');
        const checked = Boolean(props.value == '1');
        hiddenInput.checked = checked;
        const disabled = props.columnInfo.renderer.disabled;
        hiddenInput.disabled = disabled;
    }
}

class CustomCheckboxRenderer2 {
    constructor(props) {
        const { grid, rowKey, columnInfo, value } = props;
        const label = document.createElement('checkbox');
        /*         const { disabled } = props.columnInfo.renderer.options; */
        label.className = 'checkbox';
        //label.setAttribute('for', String(rowKey));

        const hiddenInput = document.createElement('input');
        hiddenInput.className = 'hidden-input2';
        hiddenInput.id = String(rowKey);

        hiddenInput.setAttribute('data-check-val', '0');

        label.appendChild(hiddenInput);

        hiddenInput.type = 'checkbox';
        hiddenInput.addEventListener('change', () => {
            if (hiddenInput.checked) {
                hiddenInput.setAttribute('data-check-val', '1');
                grid.setValue(rowKey, columnInfo.name, '1');
            } else {
                hiddenInput.setAttribute('data-check-val', '0');
                grid.setValue(rowKey, columnInfo.name, '0');
            }
            try {
                fnCustomChkboxChange();
            } catch (e) {}
        });

        this.el = label;

        this.render(props);
    }

    getElement() {
        return this.el;
    }

    render(props) {
        const hiddenInput = this.el.querySelector('.hidden-input2');
        const checked = Boolean(props.value == '1');
        hiddenInput.checked = checked;
        const disabled = props.columnInfo.renderer.disabled;
        hiddenInput.disabled = disabled;
    }
}

class CustomBtnRenderer {
    constructor(props) {
        const { grid, rowKey, columnInfo, value } = props;
        const button = document.createElement('button');
        const txtNode = document.createTextNode(value);
        button.appendChild(txtNode);

        button.className = 'btn btn-sm';

        this.el = button;
    }

    getElement() {
        return this.el;
    }
}

class CustomTextEditor {
    constructor(props) {
        const el = document.createElement('input');
        const { maxLength } = props.columnInfo.editor.options;

        el.type = 'text';
        el.maxLength = maxLength;
        el.value = String(props.value);

        this.el = el;
    }

    getElement() {
        return this.el;
    }

    getValue() {
        return this.el.value;
    }

    mounted() {
        this.el.select();
    }
}
