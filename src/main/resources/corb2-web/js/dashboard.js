var app = angular.module('dashboard',[]);
app.controller('mainCtrl', ['$scope', '$http','$interval',
                            function($scope, $http, $interval) {
		$scope.allThreadCounts=[];
		for (var i =1; i<=64; i++) {
			$scope.allThreadCounts.push(i)
		}
		$scope.threadCount =-1;
		var loadData = function(response) {
    		$scope.isLoading=false;

    		var job = response.job;
    		if (job.userProvidedOptions) {
    			$scope.userProvidedOptions = job.userProvidedOptions;//save this as this is fetched only once
    			$scope.initTaskTimeInMillis=job.initTaskTimeInMillis;
    			$scope.preBatchRunTimeInMillis=job.preBatchRunTimeInMillis;
    			$scope.urisLoadTimeInMillis=job.urisLoadTimeInMillis;
    			$scope.totalNumberOfTasks=job.totalNumberOfTasks;
    		}
    		if (job.paused === "true") {
    			$scope.pauseButtonText= "Resume Corb Job";
    			$scope.pauseButtonStyle="btn-info";
    		} else {
    			$scope.pauseButtonText= "Pause Corb Job";
    			$scope.pauseButtonStyle="btn-success";
    		}
    		$scope.successPercent = (job.numberOfSucceededTasks && job.numberOfSucceededTasks >0?((job.numberOfSucceededTasks/$scope.totalNumberOfTasks) * 100): 0);
    		$scope.successPercent = Math.round($scope.successPercent * 100) / 100;
    		$scope.successTotals = (job.numberOfSucceededTasks?job.numberOfSucceededTasks:0) +" out of "+$scope.totalNumberOfTasks +" succeeded.";
    		$scope.failedPercent = (job.numberOfFailedTasks && job.numberOfFailedTasks > 0 ?((job.numberOfFailedTasks/$scope.totalNumberOfTasks) * 100) :0);
    		$scope.failedPercent = Math.round($scope.failedPercent * 100) / 100;
    		$scope.failedTotals = (job.numberOfFailedTasks?job.numberOfFailedTasks:0) +" out of "+ $scope.totalNumberOfTasks +" failed.";
    		$scope.jobDuration = (job.totalRunTimeInMillis && job.totalRunTimeInMillis>0 ) ? msToTime(job.totalRunTimeInMillis) : "Not Running";
    		$scope.averageTransactionTimeInMillis =  Math.round(job.averageTransactionTimeInMillis * 100) / 100;
    		$scope.job = job;
    		if ($scope.threadCount === -1) {
    			$scope.threadCount = job.currentThreadCount;
    			$scope.totalNumberOfTasks = job.totalNumberOfTasks;
    		}

    	};
    	var handleError = function (error, status) {
            if (status === "404") {
            	$interval.cancel(promise);
            	$scope.allDone=100;
            	$scope.successPercent = 0;
            	$scope.failedPercent = 0;
            	$scope.pauseButtonText = "Corb Job Completed";
        		$scope.pauseButtonStyle = "disabled";
        		$scope.updateThreadsButtonStyle = "disabled";
            }
    	};
    	var promise = $interval(function() {
    		$http.get("/corb?concise=true").success(loadData).error(handleError);
    	}, 5000);
    	var pad = function(n, z) {
    	    z = z || 2;
    	    return ('00' + n).slice(-z);
    	  };
    	var msToTime = function(s) {

    		  var ms = s % 1000;
    		  s = (s - ms) / 1000;
    		  var secs = s % 60;
    		  s = (s - secs) / 60;
    		  var mins = s % 60;
    		  var hrs = (s - mins) / 60;

    		  return pad(hrs) + ':' + pad(mins) + ':' + pad(secs) ;
    		};
    	$scope.pauseResumeButtonClick = function(){
    		var reqStr = "";
    		if ($scope.job.paused === "true") {
    			reqStr= "&paused=false";
    		} else {
    			reqStr= "&paused=true";
    		}
    		$http.post("/corb","concise=true"+reqStr,{'headers':{'Content-Type': 'application/x-www-form-urlencoded'}}).success(loadData);
    	};
    	$scope.updateThreadCount = function(){
    		var reqStr = "&threads="+$scope.threadCount;
    		$http.post("/corb","concise=true"+reqStr,{'headers':{'Content-Type': 'application/x-www-form-urlencoded'}}).success(loadData);
    	};
    	$scope.updateThreadsButtonStyle="btn-primary";
		$http.get("/corb").success(loadData).error(handleError);
}]);
