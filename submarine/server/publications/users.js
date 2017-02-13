// publish user's friends strangers pending request and friend recommendation data
Meteor.publish("users/relatedUsersAndTags", function() {
  if (!this.userId)
    return this.ready();

  var user = Meteor.users.findOne({"_id": this.userId}, {"profile.friendRequest": 1,
                                                    "profile.recommendedFriends": 1,
                                                    "profile.friends": 1,
                                                    "profile.strangers": 1,
                                                    "profile.savedTags": 1
                                                  });
  // publish user seed and also social media
  var userIds = [].concat(user.profile.friendRequest,
                          user.profile.recommendedFriends.map(recommendation => recommendation.userId),
                          user.profile.friends.map(friend => friend.userId),
                          user.profile.strangers);

  // publish chat room description and status
  var tagIds = user.profile.savedTags.map(tag => tag.tagId);

  return [
    Meteor.users.find({"_id": {"$in": userIds}},
                      {
                        "fields": {
                          "profile.profileSeed": 1
                        }
                      }),
    App.Collections.Tags.find({"_id": {"$in": tagIds}},
                              {
                                "fields": {
                                  "users": 0
                                }
                              })
  ];
});

// publish user's friends strangers pending request and friend recommendation data
Meteor.publish("users/friendsInfo", function(friendId) {
  return Meteor.users.find({"_id": friendId},
                    {
                      "fields": {
                        "profile.profileSeed": 1,
                        "username": 1,
                        "emails": 1,
                        "profile.socialMedia": 1
                      }
                    });
});