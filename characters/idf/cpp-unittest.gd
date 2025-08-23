#include <gtest/gtest.h>
#include "MoraleSystem.h"

TEST(MoraleSystemTest, MoraleBoostFromAllies) {
    MoraleSystem morale;
    Unit ally1, ally2;
    morale.addNearbyAlly(ally1);
    morale.addNearbyAlly(ally2);
    EXPECT_GT(morale.getMoraleLevel(), 50);
}

[Test]
public void MiniMap_ShouldUpdateOnUnitMove() {
    var map = new MiniMap();
    var unit = new Unit { Position = new Vector2(5, 5) };
    map.TrackUnit(unit);
    unit.Position = new Vector2(6, 5);
    map.Update();
    Assert.AreEqual(new Vector2(6, 5), map.GetUnitPosition(unit));
}

