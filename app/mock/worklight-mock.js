'use strict';

var $injector = angular.injector(['ng','trackaccess.services']);
var $timeout=$injector.get('$timeout');
var $log=$injector.get('$log');
var $http=$injector.get('$http');
var $q=$injector.get('$q');

var logMsgPrefix='worklight-mock -> ';

$log.debug(logMsgPrefix + 'created');

var WL = {};



WL.Client={};

WL.Client.$mockData=$injector.get("$mockData");

//Adapter(s)
WL.Client.invokeProcedure=function(invocationData,callback) {

  $log.debug(logMsgPrefix + ' invokeProcedure ->' + invocationData.procedure);

  if (invocationData.procedure === 'submit') {
    WL.Client.$mockData.submit()
      .then(function(result){
        $log.debug(logMsgPrefix + ' submit ->' + JSON.stringify(result));
        callback.onSuccess({error:false, message:''});
      });
  }


};

//Initialise
WL.Client.init=function(options) {
  var $el = angular.element(document).find('body');
  $el.css({'display':''});

  return true;
};


//Constants
WL.constants = {
  LOCAL_STORAGE_POSTFILLED_FORMS: 'postfilledforms'
};



WL.resetMockData=function() {

  WL.Local = {
    postfilledforms :[],
    prefilledforms: {
        person_name: 'Mock Person Test',
        person_contact_no: '1234567890',
        officer_name: 'Mock Officer Test',
        officer_contact_no: '0987654321',
        officer_duty_hr: '8am-5pm'
    }
  };

  $log.debug(logMsgPrefix + ' resetMockData');

};

WL.JSONStore={};

WL.JSONStore.get=function(key) {
  return new get(key);
};

var get=function(key) {
  this.key=key;
};

get.prototype.findAll=function(query) {
  return mockJson(this.key).then(function(result) {
    return result;
  });

};

get.prototype.find=function(query) {
  var key= this.key;
  return mockJson(key).then(function(results) {

    var data=[];
    try {
      data=results.filter(function( obj ) {
        for (var idx in query) {
          key = idx;
        }
        return obj.json[key]=== query[key];
      });
    } catch(e) {

    }
    return data;

  });

};


get.prototype.replace=function(jsonArray,options) {

  var key= this.key;
  return mockJson(key).then(function(results) {
    if (jsonArray !== undefined) {

      var idx;

      if (key === WL.constants.LOCAL_STORAGE_POSTFILLED_FORMS) {
        for (idx in WL.Local.postfilledforms) {
          var postfilledforms = WL.Local.postfilledforms[idx];
          if (postfilledforms._id === jsonArray._id) {
            WL.Local.postfilledforms[idx] = jsonArray;
            break;
          }
        }
      }
    }
    return true;
  });

};

get.prototype.getAllDirty=function() {
  //Do nothing
  var deferred=$q.defer();
  return mockJson(this.key).then(function(result) {
    return result;
  });
}
get.prototype.remove=function(doc) {
  if (WL.constants.LOCAL_STORAGE_POSTFILLED_FORMS === this.key) {
    for (var idx in WL.Local.postfilledforms) {
      var postfilledforms=WL.Local.postfilledforms[idx];

      if (postfilledforms.json.id=== doc[0].json.id) {
        WL.Local.postfilledforms.splice(idx,1);
        break;
      }
    }
  }

  var deferred=$q.defer();
  deferred.resolve(true);
  return deferred.promise;
};

get.prototype.markClean=function(docs) {
  //Do nothing
  var deferred=$q.defer();
  deferred.resolve(true);
  return deferred.promise;
}

get.prototype.add=function(jsonArray, addOptions) {

  if (jsonArray !== undefined && constants.LOCAL_STORAGE_POSTFILLED_FORMS === this.key) {
    WL.Local.postfilledforms.push({json:jsonArray});
  }

  var deferred=$q.defer();
  deferred.resolve(true);
  return deferred.promise;
}

function mockJson(key) {

  var deferred=$q.defer();

  if (WL.constants.LOCAL_STORAGE_POSTFILLED_FORMS === key) {
    if (WL.Local.postfilledforms.length > 0) {
      deferred.resolve(WL.Local.postfilledforms);
    }
    else {
      WL.Client.$mockData.postFilledForms()
        .then(function(result){
        WL.Local.postfilledforms=result.data;
        deferred.resolve(result.data);
        $log.debug(logMsgPrefix + ' retrieving postfilledforms ');
      });
    }
  }



  return deferred.promise;
}


WL.resetMockData();


