var Feed = React.createClass({
    getInitialState: function () {
        var date = new Date()
        var month = (date.getMonth() + 1) + "";
        if (month.length < 2) month = "0" + month;
        var day = date.getDate() + "";
        if (day.length < 2) day = "0" + day;
        var hours = date.getHours() + "";
        if (hours.length < 2) hours = "0" + hours;
        var minutes = date.getMinutes() + "";
        if (minutes.length < 2) minutes = "0" + minutes;
        var dateLocal = date.getFullYear() + '-' + month + '-' + day + 'T' + hours + ':' + minutes;
        return {amount: '60', source: 'Hipp', date: dateLocal};
    },
    handleAmountChange: function (e) {
        this.setState({amount: e.target.value});
    },
    handleSourceChange: function (e) {
        this.setState({source: e.target.value});
    },
    handleDateChange: function (e) {
        //console.log((e.target.value) + ' - '+(new Date(e.target.value)));
        this.setState({date: e.target.value});
    },
    handleSubmit: function (e) {
        e.preventDefault();
        console.log('Submit ' + this.state.amount + ' ' + this.state.source)
        var amount = this.state.amount.trim()
        var source = this.state.source.trim()
        var date = this.state.date.trim()
        if (!amount || !source || !date) {
            return;
        }
        this.props.onFeedSubmit({amount: amount, source: source, date: new Date(date)});

        this.setState({amount: '60', source: 'Hipp', date: date});
    },
    render: function () {


        return (
            <form className="form-inline" onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <select className="form-control" id="amount" onChange={this.handleAmountChange}
                            value={this.state.amount}>
                        <option>10</option>
                        <option>15</option>
                        <option>20</option>
                        <option>25</option>
                        <option>30</option>
                        <option>35</option>
                        <option>40</option>
                        <option>45</option>
                        <option>50</option>
                        <option>55</option>
                        <option>60</option>
                        <option>65</option>
                        <option>70</option>
                        <option>75</option>
                        <option>80</option>
                        <option>85</option>
                        <option>90</option>
                        <option>95</option>
                        <option>100</option>
                        <option>105</option>
                        <option>110</option>
                    </select>
                </div>
                <div className="form-group">
                    <select className="form-control" id="source" onChange={this.handleSourceChange}
                            value={this.state.source}>
                        <option>Breast milk</option>
                        <option>Bottle milk</option>
                        <option>Hipp</option>
                    </select>
                </div>
                <div className="form-group">
                    <input type="datetime-local"
                           value={this.state.date}
                           onChange={this.handleDateChange}/>
                </div>
                <button type="submit" className="btn btn-default">Submit</button>
            </form>
        )
    }
});

function formatDate(date) {
    var month = (date.getUTCMonth() + 1) + "";
    if (month.length < 2) month = "0" + month;
    var day = date.getUTCDate() + "";
    if (day.length < 2) day = "0" + day;
    var dateLocal = day + '.' + month + '.' + date.getUTCFullYear();
    return dateLocal
}

function formatDateTime(date) {
    var hours = date.getUTCHours() + "";
    if (hours.length < 2) hours = "0" + hours;
    var minutes = date.getUTCMinutes() + "";
    if (minutes.length < 2) minutes = "0" + minutes;
    var dateLocal = formatDate(date) + ' ' + hours + ':' + minutes;
    return dateLocal
}

var HistoryRecord = React.createClass({
    render: function () {
        var dateLocal = formatDateTime(this.props.date)
        return (
            <tr>
                <td>
                    {dateLocal}
                </td>
                <td>
                    {this.props.amount}
                </td>
                <td>
                    {this.props.source}
                </td>
                <td>
                    {this.props.sum}
                </td>
            </tr>
        )
    }
});

var History = React.createClass({

    // Render our tweets
    render: function () {
        var dateToRecords = new Map()
        var chartData = new Map()
        var maxSum = new Map()
        this.props.feeds.forEach(function (feed) {
            var formattedDate = formatDate(new Date(feed.date))
            var array = dateToRecords.get(formattedDate)
            if (!array) {
                array = new Array();
                dateToRecords.set(formattedDate, array)
            }
            array.push(<HistoryRecord key={feed.id} date={new Date(feed.date)} amount={feed.amount} source={feed.source}
                                     sum={feed.sum}/>)

            var chartArray = chartData.get(formattedDate)
            if (!chartArray) {

                chartArray = new Array();
                chartData.set(formattedDate, chartArray)
                chartArray.push({
                    "date": formattedDate+" 00:00",
                    "column-1": 0,
                    "column-2": 0,
                    "column-3": 0,
                    "column-4": 0
                })
            }
            chartArray.push({
                "date": formatDateTime(new Date(feed.date)),
                "column-1": feed.sum
            })
            maxSum.set(formattedDate,feed.sum)
        })


        var menu=new Array()
        var tabs=new Array()

        dateToRecords.forEach(function(value, key) {
            var chartArray = chartData.get(key)

            chartArray.push({
                "date": key+" 23:59",
                "column-1": maxSum.get(key),
                "column-2": 540,
                "column-3": 600,
                "column-4": 660
            })
            var config = {
                "type": "serial",
                "categoryField": "date",
                "dataDateFormat": "DD.MM.YYYY HH:NN",
                "categoryAxis": {
                    "minPeriod": "mm",
                    "parseDates": true
                },
                "chartCursor": {
                    "enabled": true,
                    "categoryBalloonDateFormat": "JJ:NN"
                },
                "chartScrollbar": {
                    "enabled": true
                },
                "trendLines": [],
                "graphs": [
                    {
                        "bullet": "round",
                        "fontSize": -2,
                        "id": "AmGraph-1",
                        "title": "Total",
                        "valueField": "column-1"
                    },
                    {
                        "id": "AmGraph-2",
                        "title": "90ml*6",
                        "dashLength": 10,
                        "valueField": "column-2"
                    },
                    {
                        "id": "AmGraph-3",
                        "title": "100ml*6",
                        "dashLength": 10,
                        "valueField": "column-3"
                    },
                    {
                        "id": "AmGraph-4",
                        "title": "110ml*6",
                        "dashLength": 10,
                        "valueField": "column-4"
                    }
                ],
                "guides": [],
                "valueAxes": [
                    {
                        "id": "ValueAxis-1",
                        "title": "ml"
                    }
                ],
                "allLabels": [],
                "balloon": {},
                "legend": {
                    "enabled": true,
                    "useGraphSettings": true
                },
                "titles": [
                    {
                        "id": "Title-1",
                        "size": 15,
                        "text": "Feed total"
                    }
                ],
                "dataProvider": chartData.get(key)
            };
            console.log(config)
            var itemName=key.replace('.', '').replace('.', '');
            menu.push(<li key={key}><a data-toggle="tab" href={'#'+itemName}>{key}</a></li>)
            tabs.push(<div key={key} id={itemName} className="tab-pane fade">

                <table className="table table-striped">
                    <tbody>
                    <tr>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Source</th>
                        <th>Sum for today</th>
                    </tr>
                    {value}
                    </tbody>
                </table>
                <AmCharts.React {...config}/>
            </div>)
        });


        var chart=""
        // Build list items of single tweet components using map



        // Return ul filled with our mapped tweets
        return (
            <div>
                <ul className="nav nav-tabs">
                    {menu}
                </ul>
                <div className="tab-content">
                    {tabs}
                    </div>
            </div>
        )

    }

});


var MilkLogger = React.createClass({
    loadFeedsFromServer: function () {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({feeds: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleFeedSubmit: function (feed) {
        console.log('Handle ' + feed)
        var currentFeeds = this.state.feeds;
        // Optimistically set an id on the new comment. It will be replaced by an
        // id generated by the server. In a production application you would likely
        // not use Date.now() for this and would have a more robust system in place.
        feed.id = Date.now();
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: feed,
            success: function (data) {
                this.setState({feeds: data});
            }.bind(this),
            error: function (xhr, status, err) {
                this.setState({feeds: currentFeeds});
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function () {
        return {feeds: []};
    },
    componentDidMount: function () {
        this.loadFeedsFromServer();
        // setInterval(this.loadFeedsFromServer, this.props.pollInterval);
    },

    // Render the component
    render: function () {

        return (
            <div className="feed-app">
                <Feed onFeedSubmit={this.handleFeedSubmit}/>
                <History feeds={this.state.feeds}/>
            </div>
        )

    }
});
ReactDOM.render(
    <MilkLogger url="/feed"/>,
    document.getElementById('content')
);

