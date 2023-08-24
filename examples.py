# Example 1
# Check if team isActive, if not render joinQueue button and numberInQueue
    if league is None:
        query = text(f'''
            SELECT t.id, t.rank, t.region, t.isQueued
            FROM Team t
            WHERE t.isQueued = 1
        ''')

        with db.engine.connect() as conn:
            teamsList = conn.execute(query).fetchall()

        # Filter out teams that don't match current teams rank and region
        filteredTeams = [t for t in teamsList if ((t.rank == team.rank) and (t.region == team.region) and (t.isQueued))]
        numberInQueue = len(filteredTeams)

# Example 2
# Get all season matchups from Stats table associated with the League.id and Team.id
        matchupQuery = text(f'''
            SELECT s.Series_id, s.Team0_id, s.Team1_id, t1.teamName AS Team0_name, t2.teamName AS Team1_name,
                COUNT(CASE WHEN s.winningTeam = s.Team0_id THEN 1 END) AS Team0_wins,
                COUNT(CASE WHEN s.winningTeam = s.Team1_id THEN 1 END) AS Team1_wins,
                t1.team_banner, t2.team_banner
            FROM Stats s
            JOIN Team t1 ON s.Team0_id = t1.id
            JOIN Team t2 ON s.Team1_id = t2.id
            WHERE s.League_id = {league.id} AND round_one = 0 AND round_two = 0 AND round_three = 0 AND (s.Team0_id = {team_id} OR s.Team1_id = {team_id})
            GROUP BY s.Series_id, s.Team0_id, s.Team1_id, t1.teamName, t2.teamName;
        ''')

        with db.engine.connect() as conn:
            matchList = conn.execute(matchupQuery).fetchall()

        match_num = 1
        matchups = {}
        for row in matchList:
            series_id = row[0]
            matchups[series_id] = {
                "Match_num": match_num,
                "Team0_id": row[1],
                "Team0_name": row[3],
                "Team0_wins": row[5],
                "Team0_banner": row[7],
                "Team1_id": row[2],
                "Team1_name": row[4],
                "Team1_wins": row[6],
                "Team1_banner": row[8]
            }
            match_num = match_num + 1
  
# Example 3, entire /teams view
@views.route('/teams')
def teams():
    #Find all usernames from each teamId associated with the current_user.id's teamId's (that's a mouthful)
    query = text(f'''
        SELECT u.username, u.profile_image, t.teamName, t.id, t.teamCaptain, t.team_logo, t.team_banner
        FROM User u
        INNER JOIN TeamPlayers tp ON u.id = tp.userId
        INNER JOIN Team t ON tp.teamId = t.id
        WHERE tp.teamId IN (
            SELECT tp2.teamId
            FROM TeamPlayers tp2
            WHERE tp2.userId = {current_user.id}
        );
    ''')
    with db.engine.connect() as con:
        result = con.execute(query)
        teams = result.fetchall()
        
        # Store the results in a nested dictionary to make it easier to access with Jinja
        team_users = {}
        for team in teams:
            team_id = team[3]
            if team_id not in team_users:
                team_users[team_id] = {
                    'team_name': team[2],
                    'team_captain': team[4],
                    'team_logo': team[5],
                    'team_banner': team[6],
                    'users': []
                }
            team_users[team_id]['users'].append({
                'username': team[0],
                'profile_image': team[1]
            })

    # Pass team.id, team.teamName and their associated user.usernames to be rendered
    return render_template('teams.html', user=current_user, teams=team_users)