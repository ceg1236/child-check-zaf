(function() {

  return {
    events: {
      'app.activated':'init',
      'ticket.save':'checkChild',
      'click .yes':'createInternalNote',
      'shown #myModal':'passDataToModal'
    },

    requests: {
      getTicketData: function(id) {
        return {
          url: helpers.fmt('/api/v2/tickets/%@.json', id),
          type: 'GET'
        };
      },

      updateParentTicket: function(data) {
        return {
          url: helpers.fmt('/api/v2/tickets/%@.json', data.parentId),
          type:'PUT',
          dataType:'json',
          data: {"ticket": {"comment":{ "body": data.comment,"public":false} } },
          success: function(data) {console.log('yay!', data);},
          error:function(err){console.log(': (', err);}
        };
      }
    },

    currentTicketData: {},

    init: function() {
      // this.switchTo('main');
    },


    checkChild: function() {
      var ticketId = this.ticket().id();
      var ticketData;

      this.$('#myModal').modal();
      debugger;
      this.ajax('getTicketData', ticketId).done(function (response) {
        this.currentTicketData = response;
        this.currentTicketData.comment = this.comment().text();
        ticketData = response;
        var expression = /child_of_([0-9])/;
        console.log('ticket', ticketData, 'ext', ticketData.ticket.external_id);
        if ( ticketData.ticket.external_id.match(expression) ) {

          var data = { parentId: ticketData.ticket.external_id.slice(9) };

          this.$('#myModal').modal({show:true});

        } 
        return true; 
      });
      
    },

    createInternalNote: function(parentId) {
      console.log(this.currentTicketData.ticket.external_id);
      var data = {};
      data.comment = this.currentTicketData.comment;
      data.parentId = this.currentTicketData.ticket.external_id.slice(9);
      console.log(data);

      this.ajax('updateParentTicket', data).done(function() {
        console.log('updated Parent with '  , data); 
      });

    }
  };

}());
