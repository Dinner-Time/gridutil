/**
 * @author 박태훈
 * @since 2021-12-23
 *
 */
class SearchDate extends HTMLElement {
    constructor() {
        super();
        this.proto = {};

        const container = document.createElement('div');
        container.classList = 'tui-datepicker-input tui-datetime-input tui-has-focus';
        container.style.width = '120px';

        const input = document.createElement('input');
        input.type = 'text';
        input.setAttribute('aria-label', 'Date-Time');

        const span = document.createElement('span');
        span.classList = 'tui-ico-date';

        const wrapper = document.createElement('div');
        wrapper.style.marginLeft = '-1px';

        this.proto.container = container;
        this.proto.input = input;
        this.proto.span = span;
        this.proto.wrapper = wrapper;
    }

    connectedCallback() {
        if (this.search === 'range') this.range();
        else if (this.search === 'single') this.single();
    }

    range() {
        this.from = {
            container: this.proto.container.cloneNode(),
            input: this.proto.input.cloneNode(),
            span: this.proto.span.cloneNode(),
            wrapper: this.proto.wrapper.cloneNode(),
        };
        this.from.input.name = 'searchDate1';
        this.from.input.id = 'searchDate1';
        this.from.wrapper.id = 'searchDate1-wrapper';

        const between = document.createElement('label');
        between.classList = 'mr-1 ml-1';
        between.innerHTML = '~';

        this.to = {
            container: this.proto.container.cloneNode(),
            input: this.proto.input.cloneNode(),
            span: this.proto.span.cloneNode(),
            wrapper: this.proto.wrapper.cloneNode(),
        };
        this.to.input.name = 'searchDate2';
        this.to.input.id = 'searchDate2';
        this.to.wrapper.id = 'searchDate2-wrapper';

        this.from.container.appendChild(this.from.input);
        this.from.container.appendChild(this.from.span);
        this.from.container.appendChild(this.from.wrapper);
        this.appendChild(this.from.container);

        this.appendChild(between);

        this.to.container.appendChild(this.to.input);
        this.to.container.appendChild(this.to.span);
        this.to.container.appendChild(this.to.wrapper);
        this.appendChild(this.to.container);
    }

    single() {
        this.single = {
            input: this.proto.input.cloneNode(true),
            span: this.proto.span.cloneNode(true),
            wrapper: this.proto.wrapper.cloneNode(true),
        };

        this.single.input.name = this.code;
        this.single.input.id = this.code;
        this.single.wrapper.id = `${this.code}-wrapper`;

        this.proto.container.appendChild(this.single.input);
        this.proto.container.appendChild(this.single.span);
        this.proto.container.appendChild(this.single.wrapper);

        this.appendChild(this.proto.container);
    }

    setPicker(end = new Date(), start = new Date() - 30 * 24 * 60 * 60 * 1000) {
        if (this.search === 'range') {
            this.picker = new tui.DatePicker.createRangePicker({
                startpicker: {
                    date: new Date(start),
                    input: '#searchDate1',
                    container: '#searchDate1-wrapper',
                },
                endpicker: {
                    date: new Date(end),
                    input: '#searchDate2',
                    container: '#searchDate2-wrapper',
                },
                selectableRanges: [[new Date(0), new Date(new Date(end).getFullYear() + 1, new Date(end).getMonth(), new Date(end).getDate())]],
                language: 'ko',
            });

            this.start = start;
            this.end = end;
        } else {
            this.picker = new tui.DatePicker(`#${this.code}-wrapper`, {
                date: new Date(end),
                type: 'date',
                input: {
                    element: `#${this.code}`,
                    format: 'yyyy-MM-dd',
                },
                language: 'ko',
            });

            this.end = end;
        }
        return this;
    }

    init() {
        if (this.search === 'range') {
            this.picker.setStartDate(this.start);
            this.picker.setEndDate(this.end);

            const startDate = this.picker._startpicker._datepickerInput._formatter.format(new Date(this.start));
            const endDate = this.picker._startpicker._datepickerInput._formatter.format(new Date(this.end));
            document.querySelector('#searchDate1').value = startDate;
            document.querySelector('#searchDate2').value = endDate;
        } else {
            this.picker.setDate(this.end);
            const date = this.picker._datepickerInput._formatter.format(new Date(this.end));
            document.querySelector(`#${this.code}`).value = date;
        }
        // rangeInit() {

        //     // setDate로 input이 안바뀌는 경우가 생겨서 추가한 코드
        //     $(this.from.input).val(
        //         this.rangePicker._startpicker._datepickerInput._formatter.format(new Date(this.from.date))
        //     );
        //     $(this.to.input).val(this.rangePicker._startpicker._datepickerInput._formatter.format(new Date(this.to.date)));
        // }

        // dateInit() {
        //     this
        //     // setDate로 input이 안바뀌는 경우가 생겨서 추가한 코드
        //     $(this.input).val(this.datePicker._datepickerInput._formatter.format(new Date(this.date)));
        // }
    }

    static get observedAttributes() {
        // 모니터링 할 속성 이름
        return ['search', 'code'];
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        // 속성이 추가/제거/변경되었다.
        this[attrName] = newVal;
    }
}
customElements.define('search-date', SearchDate);

class ReportButtons extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // DOM에 추가되었다. 렌더링 등의 처리를 하자.
        const reset = document.createElement('button');
        reset.type = 'button';
        reset.classList = 'btn btn-reset mr-1';
        reset.innerHTML = '신규';
        this.reset = reset;

        const search = document.createElement('button');
        search.type = 'button';
        search.classList = 'btn btn-search mr-1';
        search.innerHTML = '조회';
        this.search = search;

        const excel = document.createElement('button');
        excel.type = 'button';
        excel.classList = 'btn btn-exel mr-1';
        excel.innerHTML = 'Excel';
        this.excel = excel;

        const print = document.createElement('button');
        print.type = 'button';
        print.classList = 'btn btn-print';
        print.innerHTML = '인쇄';
        this.print = print;

        this.appendChild(reset);
        this.appendChild(search);
        this.appendChild(excel);
        this.appendChild(print);
    }

    static get observedAttributes() {
        // 모니터링 할 속성 이름
        return ['reset', 'search', 'excel', 'print'];
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        // 속성이 추가/제거/변경되었다.
    }

    setGrid(grid) {
        this.grid = grid;
        return this;
    }

    setForm(form) {
        this.form = form;
        return this;
    }

    setUrl(url) {
        this.url = url;
        return this;
    }

    setReportOption(opt) {
        for (let item in opt) {
            this[item] = opt[item];
        }
        return this;
    }

    defaultReset() {
        this.reset.addEventListener('click', () => {
            this.form.reset();
            this.grid.gridInit();
            this.date.init();
        });
        return this;
    }

    defaultSearch(subtotal = null) {
        this.search.addEventListener('click', () => {
            Util.postFetch(this.url.search, JSON.stringify(Util.formToJson(this.form)))
                .then((result) => {
                    console.log(result);
                    return result.result;
                })
                .then((data) => {
                    console.log(data);
                    if (data.length === 0) throw '조회된 데이터가 없습니다.';
                    else {
                        if (subtotal) this.grid.makeSubtotalGrid(data, subtotal());
                        else this.grid.makeGrid(data);
                    }
                })
                .catch((err) => {
                    toastr.warning(err);
                    console.log(err);
                    this.grid.gridInit();
                });
        });
        return this;
    }

    defaultPrint() {
        this.print.addEventListener('click', () => {
            if (this.grid.getData().length === 0) toastr.warning('자료조회를 먼저 해주세요');
            else {
                this.form.action = this.url.print;
                if (this.form.gridData) this.form.gridData.value = JSON.stringify(this.grid.getData());
                this.form.target = '_blank';
                this.form.submit();
            }
        });
        return this;
    }

    defaultExcel() {
        this.excel.addEventListener('click', () => {
            if (this.grid.getData().length === 0) toastr.warning('자료조회를 먼저 해주세요');
            else {
                const data = this.grid.getData();
                const headers = this.grid.getHeaders();
                const arr = [];
                const obj = {};

                arr.push(headers);
                this.grid.option.columns.forEach((column) => {
                    obj[column.header] = column.name;
                });

                data.forEach((row) => {
                    const tempArr = [];
                    headers.forEach((header) => {
                        tempArr.push(row[obj[header]]);
                    });
                    arr.push(tempArr);
                });

                Util.excelFetch(this.url.excel, JSON.stringify(arr))
                    .then((result) => console.log(result))
                    .catch((err) => console.log(err));
            }
        });
        return this;
    }

    setDefault(subtotal = null) {
        this.defaultReset();
        this.defaultSearch(subtotal);
        this.defaultExcel();
        this.defaultPrint();
    }

    setEvent(events) {
        for (let item in events) {
            this[item].addEventListener('click', () => events[item]());
        }
    }
}
customElements.define('report-buttons', ReportButtons);

class SearchKeyword extends HTMLElement {
    constructor() {
        super();
        this.proto = {};
        const input = document.createElement('input');
        input.classList = 'form-control ta-r w150';
        input.type = 'text';

        const button = document.createElement('button');
        button.type = 'button';
        button.classList = 'btn-top btn-find-small';

        const name = document.createElement('input');
        name.classList = 'form-control ta-l w200';
        name.type = 'text';
        name.readOnly = true;

        this.proto.input = input;
        this.proto.button = button;
        this.proto.name = name;
    }

    connectedCallback() {
        // DOM에 추가되었다. 렌더링 등의 처리를 하자.
        if (this.search === 'range') this.rangeSearch();
        else if (this.search === 'single') this.singleSearch();
    }

    rangeSearch() {
        this.from = {
            input: this.proto.input.cloneNode(true),
            button: this.proto.button.cloneNode(true),
            name: this.proto.name.cloneNode(true),
        };
        this.from.input.name = 'searchKeywordFrom';
        this.from.name.name = 'searchKeywordFromNm';

        const between = document.createElement('label');
        between.classList = 'mr-1 ml-1';
        between.innerHTML = '~';

        this.to = {
            input: this.proto.input.cloneNode(true),
            button: this.proto.button.cloneNode(true),
            name: this.proto.name.cloneNode(true),
        };
        this.to.input.name = 'searchKeywordTo';
        this.to.name.name = 'searchKeywordToNm';

        this.appendChild(this.from.input);
        this.appendChild(this.from.button);
        this.appendChild(this.from.name);

        this.appendChild(between);

        this.appendChild(this.to.input);
        this.appendChild(this.to.button);
        this.appendChild(this.to.name);
    }

    singleSearch() {
        this.single = {
            input: this.proto.input.cloneNode(true),
            button: this.proto.button.cloneNode(true),
            name: this.proto.name.cloneNode(true),
        };

        this.single.input.name = this.code;
        this.single.name.name = this.name;

        this.appendChild(this.single.input);
        this.appendChild(this.single.button);
        this.appendChild(this.single.name);
    }

    static get observedAttributes() {
        // 모니터링 할 속성 이름
        return ['search', 'code', 'name'];
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        // 속성이 추가/제거/변경되었다.
        this[attrName] = newVal;
    }

    setEvents(url, param) {
        if (this.search === 'range') {
            this.from.button.addEventListener('click', () => {
                this.condition = 'from';
                fnAjaxLoad(url + param + encodeURIComponent(this.from.input.value), 'SearchViewPopup');
            });
            this.to.button.addEventListener('click', () => {
                this.condition = 'to';
                fnAjaxLoad(url + param + encodeURIComponent(this.to.input.value), 'SearchViewPopup');
            });
        } else if (this.search === 'single') {
            this.single.button.addEventListener('click', () => {
                fnAjaxLoad(url + param + encodeURIComponent(this.single.input.value), 'SearchViewPopup');
            });
        }

        return this;
    }

    setCallback(data) {
        if (this.search === 'range') {
            if (this.condition === 'from') {
                this.from.input.value = data.cd;
                this.from.name.value = data.value;
            } else {
                this.to.input.value = data.cd;
                this.to.name.value = data.value;
            }
        } else if (this.search === 'single') {
            this.single.input.value = data.cd;
            this.single.name.value = data.value;
        }
    }
}
customElements.define('search-keyword', SearchKeyword);
